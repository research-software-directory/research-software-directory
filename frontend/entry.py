from app.application import application

if __name__ == '__main__':
    application.jinja_env.auto_reload = True
    application.config['TEMPLATES_AUTO_RELOAD'] = True
    application.run(debug=True, host='0.0.0.0', port=5004)
