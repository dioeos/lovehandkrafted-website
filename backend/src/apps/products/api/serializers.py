from rest_framework import serializers
from ..models import Product, ProductTag
from django.db import IntegrityError
import json

class ProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductTag
        fields = ['id', 'name', 'product_count']

    def validate_name(self, value: str):
        name = (value or "").strip()
        if not name:
            raise serializers.ValidationError("Please enter a tag name.")

        # Case-insensitive uniqueness check (fast fail)
        qs = ProductTag.objects.all()
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.filter(name__iexact=name).exists():
            raise serializers.ValidationError("A tag with this name already exists.")
        return name

    def create(self, validated_data):
        name = validated_data['name']
        try:
            # Use create so validation/DB constraint are authoritative
            return ProductTag.objects.create(name=name)
        except IntegrityError:
            # Handle race two clients creating same name at once
            raise serializers.ValidationError({
                "name": ["A tag with this name already exists."]
            })

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        try:
            instance.save()
        except IntegrityError:
            raise serializers.ValidationError({
                "name": ["A tag with this name already exists."]
            })
        return instance


class ProductSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
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
        # print("CREATING...")
        # print(f"Validated Data: {validated_data}")
        tags_raw = self.initial_data.get('tags', '[]')
        try:
            tags_data = json.loads(tags_raw)
        except json.JSONDecodeError:
            tags_data = []
        validated_data.pop('tags', None)
        # print(f"Parsed Tags Data: {tags_data}")

        product = Product.objects.create(**validated_data)

        for tag_data in tags_data:
            tag_name = tag_data.get('name')
            if tag_name:
                tag, _ = ProductTag.objects.get_or_create(name=tag_name)
                product.tags.add(tag)

        return product
    
    def update(self, instance, validated_data):
        """Handles product updates"""
        tags_raw = self.initial_data.get('tags', '[]')
        try:
            tags_data = json.loads(tags_raw)
        except json.JSONDecodeError:
            tags_data = []

        validated_data.pop('tags', None)
        # print(f"Updated Parsed Tags Data: {tags_data}")

        for attr, value in validated_data.items():
            setattr(instance, attr, value) #update fields
        for tag_data in tags_data:
            tag_name = tag_data.get('name')
            if tag_name:
                tag, _ = ProductTag.objects.get_or_create(name=tag_name)
                # print(f"Updated Tag Object: {tag}")
                instance.tags.add(tag)

        instance.save()
        return instance
