from app.application import application
from sassutils.wsgi import SassMiddleware

if __name__ == '__main__':
    application.jinja_env.auto_reload = True
    application.config['TEMPLATES_AUTO_RELOAD'] = True
    application.wsgi_app = SassMiddleware(application.wsgi_app, {
        __name__: ('style', 'static/style', '/static/style')
    })
    application.run(debug=True, host='0.0.0.0', port=5004)
