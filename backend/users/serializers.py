from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class RegisterSerializer(serializers.Serializer):
    """Validates registration data and creates User + UserProfile."""
    first_name = serializers.CharField(max_length=30)
    last_name  = serializers.CharField(max_length=30)
    email      = serializers.EmailField()
    password   = serializers.CharField(min_length=8, write_only=True)
    city       = serializers.CharField(max_length=100, required=False, default='')
    country    = serializers.CharField(max_length=100, required=False, default='')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        # Use email as username (lowercase)
        username = validated_data['email'].lower().split('@')[0]
        # Ensure unique username
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f'{base}{counter}'
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        location = ''
        if validated_data.get('city') and validated_data.get('country'):
            location = f"{validated_data['city']}, {validated_data['country']}"
        elif validated_data.get('city'):
            location = validated_data['city']
        elif validated_data.get('country'):
            location = validated_data['country']

        UserProfile.objects.create(
            user=user,
            location=location,
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Validates login credentials."""
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    """Validates forgot-password data (direct reset for hackathon)."""
    email        = serializers.EmailField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No account found with this email.')
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """Full profile serializer combining User + UserProfile data."""
    username   = serializers.CharField(source='user.username', read_only=True)
    email      = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name  = serializers.CharField(source='user.last_name', read_only=True)
    full_name  = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'avatar_url', 'bio', 'location', 'phone', 'created_at',
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class ProfileUpdateSerializer(serializers.Serializer):
    """For updating profile fields."""
    first_name = serializers.CharField(max_length=30, required=False)
    last_name  = serializers.CharField(max_length=30, required=False)
    bio        = serializers.CharField(required=False, allow_blank=True)
    location   = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone      = serializers.CharField(max_length=20, required=False, allow_blank=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
