# signals.py
from django.db.models.signals import m2m_changed
from django.db.models.signals import m2m_changed, pre_delete, post_delete
from django.dispatch import receiver
from django.apps import apps

def tag_products_changed(sender, instance, action, reverse, **kwargs):
    """
    Keep ProductTag.product_count in sync when the M2M changes.
    - instance is ProductTag when reverse=False
    - instance is Product when reverse=True
    """
    if action not in {"post_add", "post_remove", "post_clear"}:
        return

    if reverse:
        # instance is Product; update its tags (only touching what changed is faster)
        tag_qs = instance.tags.all()
        # If you want to limit to only changed tags:
        # pk_set = kwargs.get("pk_set")
        # tag_qs = instance.tags.filter(pk__in=pk_set) if pk_set else instance.tags.all()
        for tag in tag_qs:
            tag.product_count = tag.products.count()
            tag.save(update_fields=["product_count"])
    else:
        # instance is ProductTag
        instance.product_count = instance.products.count()
        instance.save(update_fields=["product_count"])


@receiver(pre_delete, sender=None)
def product_capture_tag_ids(sender, instance, **kwargs):
    # Only act for the Product model (avoid circular import)
    Product = apps.get_model("products", "Product")
    if sender is not Product:
        return
    # Capture tag IDs before the through rows are trashed
    try:
        instance._tag_ids = list(instance.tags.values_list("id", flat=True))
    except Exception:
        instance._tag_ids = []

@receiver(post_delete, sender=None)
def product_update_tag_counts_after_delete(sender, instance, **kwargs):
    Product = apps.get_model("products", "Product")
    ProductTag = apps.get_model("products", "ProductTag")
    if sender is not Product:
        return
    tag_ids = getattr(instance, "_tag_ids", [])
    if not tag_ids:
        return
    # Recompute counts for affected tags
    for tag in ProductTag.objects.filter(id__in=tag_ids):
        tag.product_count = tag.products.count()
        tag.save(update_fields=["product_count"])
