from rest_framework import serializers
from ..models import Product, ProductTag

class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name']

    def validate_name(self, value):
        """Ensure that tag name is unique"""
        print("VALIDATING PRODUCT TAG")
        return value

    def create(self, validated_data):
        """Tag create method, fetches or creates"""
        print("CALLING CREATE PRODUCT TAG")
        tag_name = validated_data.get('name')
        tag, _ = ProductTag.objects.get_or_create(name=tag_name)
        return tag


class ProductSerializer(serializers.ModelSerializer):
    tags = ProductTagSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'active',
            'default_price',
            'thumbnail',
            'quantity',
            'created_at',
            'updated_at',
            'tags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Handles product creation"""
        print("CREATING...")
        tags_data = validated_data.pop('tags', []) #extract tags
        print(f"Tags Data: {tags_data}")
        product = Product.objects.create(**validated_data)
        for tag_data in tags_data:
            #iterates over tags_data dictionary and gets or create tag
            tag_name = tag_data.get('name')
            if tag_name:
                tag, _ = ProductTag.objects.get_or_create(name=tag_name)
                print(f"Tag object: {tag}")
                product.tags.add(tag)

        return product
    
    def update(self, instance, validated_data):
        """Handles product updates"""
        tags_data = validated_data.pop('tags', None) #pop tags
        for attr, value in validated_data.items():
            setattr(instance, attr, value) #update fields
        if tags_data is not None:
            instance.tags.clear()
            for tag_data in tags_data:
                tag_name = tag.get('name')
                if tag_name:
                    tag, _ = ProductTag.objects.get_or_create(name=tag_name)
                    instance.tags.add(tag)

        instance.save()
        return instance