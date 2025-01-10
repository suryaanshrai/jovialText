from django.urls import include, path
from rest_framework import routers

from jovialApi import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'like', views.LikeViewSet)
router.register(r'post', views.PostViewSet)
router.register(r'follow', views.FollowerViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/register/', include('dj_rest_auth.registration.urls')),

]