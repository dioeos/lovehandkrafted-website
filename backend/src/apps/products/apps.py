from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    label = "products"

    def ready(self):
        from django.apps import apps
        from django.db.models.signals import m2m_changed
        from . import signals

        ProductTag = apps.get_model("products", "ProductTag")
        m2m_changed.connect(
            signals.tag_products_changed,
            sender=ProductTag.products.through,
            dispatch_uid="producttag_products_counter_cache",
        )
