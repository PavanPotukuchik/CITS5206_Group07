from flask import Flask, render_template,request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', active_page='dashboard')

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
    user_id = request.args.get('userId')
    if user_id:
        return render_template('documents.html', user_id=user_id, active_page='documents')
    return render_template('documents.html', active_page='documents')

@app.route('/client-dashboard')
def client_dashboard():
    return render_template('client.html', active_page='projects')

@app.route('/client-files')
def client_files():
    return render_template('client-files.html', active_page='files')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
