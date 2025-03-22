from rest_framework import serializers
from ..models import Product, ProductTag

class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name']


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
        tags_data = validated_data.pop('tags', []) #extract tags
        product = Product.objects.create(**validated_data)
        for tag_data in tags_data:
            #iterates over tags_data dictionary and gets or create tag
            tag, created = ProductTag.objects.get_or_create(**tag_data)
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
                tag, created = ProductTag.objects.get_or_create(**tag_data)
                instance.tags.add(tag)
        instance.save()
        return instance