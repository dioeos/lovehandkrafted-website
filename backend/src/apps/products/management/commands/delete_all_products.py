from django.core.management.base import BaseCommand
from apps.products.models import Product
from decouple import config
import requests

class Command(BaseCommand):
    def handle(self, *args, **options):
        products = Product.objects.all()

        for product in products:
            if product.thumbnail:
                self.stdout.write(f"Product has thumbnail, deleting: {product.thumbnail}")
                #delete logic
                r2_worker_base_url = config("R2_WORKER_BASE_URL")
                x_cust_auth_key = config("R2_WORKER_AUTH_KEY_SECRET")
                key = product.thumbnail.replace(f"{r2_worker_base_url}/", "")
                delete_url = f"{r2_worker_base_url}/{key}"

                res = requests.delete(
                    delete_url,
                    headers={
                        "X-Custom-Auth-Key": x_cust_auth_key
                    }
                )

                if res.status_code != 200:
                    self.stdout.write(self.style.ERROR(f"Failed to delete product thumbail: {delete_url}"))

        products.delete()

        if Product.objects.all().count() == 0:
            self.stdout.write(self.style.SUCCESS("Successfully deleted all products."))
        else:
            self.stdout.write(self.style.ERROR("Failed to delete all products."))
