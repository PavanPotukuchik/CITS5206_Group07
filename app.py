from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/clients-list')
def clients_list():
    return render_template('clients-list.html', active_page='clients')

@app.route('/add-client')
def add_client():
    return render_template('add-client.html')

@app.route('/project-list')
def project_list():
    return render_template('project-list.html', active_page='project')

@app.route('/project-form')
def project_form():
    return render_template('project-form.html', active_page='project-form')

@app.route('/documents')
def documents():
    return render_template('documents.html', active_page='documents')

@app.route('/client-dashboard')
def client_dashboard():
    return render_template('client.html', active_page='projects')

@app.route('/client-files')
def client_files():
    return render_template('client-files.html', active_page='files')

@app.route('/client-projects')
def client_projects():
    return render_template('client-projects.html', active_page='projects')

@app.route('/client-settings')
def client_settings():
    return render_template('client-settings.html', active_page='settings')

@app.route('/modify-settings')
def modify_settings():
    return render_template('modify-settings.html', active_page='settings')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/project-detail')
def project_detail():
    return render_template('project-detail.html', active_page='project')

@app.route('/project-detail-client')
def project_detail_client():
    return render_template('project-detail-client.html', active_page='project')

if __name__ == '__main__':
    app.run(debug=True)