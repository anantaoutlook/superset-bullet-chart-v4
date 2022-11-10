import os
class ReverseProxied(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)

ADDITIONAL_MIDDLEWARE = [ReverseProxied, ]

MAPBOX_API_KEY = os.getenv('MAPBOX_API_KEY', '')
CACHE_CONFIG = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 300,
    'CACHE_KEY_PREFIX': 'superset_',
    'CACHE_REDIS_HOST': 'localhost',
    'CACHE_REDIS_PORT': 6379,
    'CACHE_REDIS_DB': 2,
    'CACHE_REDIS_URL': 'redis://localhost:6379/2'}

#SQLALCHEMY_DATABASE_URI = \
    #'postgresql+psycopg2://kpidba:kpid3v3lop3r@wp-onboard-db.csb7zmulmvsb.us-east-1.rds.amazonaws.com:5432/superset'
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://supersetdev:supersetdev123@10.2.34.190:5432/supersetdev'
    
SQLALCHEMY_TRACK_MODIFICATIONS = True
SECRET_KEY = 'thisISaSECRET_1234'

ENABLE_PROXY_FIX = True

