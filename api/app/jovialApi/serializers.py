from django.contrib.auth.models import Group
from .models import User, Post, Like, Follower
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'url','username','bio', 'pic']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ['url','id','username', 'content', 'pic', 'time', 'title']


class LikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Like
        # Remove id as an feild in production
        fields = ['url','id','post']


class FollowerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follower
        fields = ['url','follow']