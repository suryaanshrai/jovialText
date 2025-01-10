from django.contrib.auth.models import Group
from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import User, Follower, Like, Post

from jovialApi.serializers import UserSerializer, PostSerializer, FollowerSerializer, LikeSerializer


class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        print(serializer)
        serializer.save(username=self.request.user)


class FollowerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows followers to be viewed or edited.
    """
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Follower.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)
        

class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.all().order_by('time')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if request.user != post.username:
            raise PermissionDenied("You do not have permission to edit this post.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        post = self.get_object()
        if request.user != post.username:
            raise PermissionDenied("You do not have permission to edit this post.")
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if request.user != post.username:
            raise PermissionDenied("You do not have permission to delete this post.")
        return super().destroy(request, *args, **kwargs)



class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self,):
        if self.action == 'list':
            if self.request.user.is_authenticated:
                return User.objects.filter(username=self.request.user.username) 
            return User.objects.none()
        return User.objects.all()

    def retrieve(self, request, *args, **kwargs):
        self.permission_classes = [permissions.AllowAny]
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        raise PermissionDenied("You do not have permission to create a new user.")

    def update(self, request, *args, **kwargs):
        if request.user.id != int(kwargs['pk']):
            raise PermissionDenied("You do not have permission to edit this user.")
        self.permission_classes = [IsAuthenticated]
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.id != int(kwargs['pk']):
            raise PermissionDenied("You do not have permission to edit this user.")
        self.permission_classes = [IsAuthenticated]
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.id != int(kwargs['pk']):
            raise PermissionDenied("You do not have permission to delete this user.")
        self.permission_classes = [IsAuthenticated]
        return super().destroy(request, *args, **kwargs)