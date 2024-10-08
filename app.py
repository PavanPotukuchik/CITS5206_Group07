ChangeRequestForm
ChangeRequestForm
from flask import Flask, render_template,request,flash
=======
from flask import Flask, render_template
=======
kkglove
from flask import Flask, render_template
from datetime import datetime
import requests
=======
ChangeRequestForm
from flask import Flask, render_template,request,flash
=======
from flask import Flask, render_template
main
main
main

app = Flask(__name__)

POCKETBASE_URL = "http://127.0.0.1:8090"

@app.route('/')
def index():
    return render_template('index.html')
kkglove

=======
main

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/changePassword')
def changePassword():
    return render_template('changePassword.html', active_page='changePassword')

@app.route('/clients-list')
def clients_list():
    return render_template('clients-list.html', active_page='clients')

@app.route('/add-client')
def add_client():
    return render_template('add-client.html')

@app.route('/project-list')
def project_list():
    return render_template('project-list.html', active_page='project')

@app.route('/project-form')   #,methods=['GET', 'POST']
def project_form():
    # if request.method == 'POST':
    #     # Get the project title from the form
    #     project_title = request.form.get('projectTitle')

    #     if not project_title:
    #         return "Project title is required", 400 

    #     # Create the project in PocketBase
    #     try:
    #         # API endpoint for creating a new project in PocketBase 
    #         url = f"{POCKETBASE_URL}/api/collections/projects/records"

    #         # Data to send to PocketBase
    #         data = {
    #             "title": project_title
    #         }

    #         # Make the POST request to create the project
    #         response = request.post(url, json=data)

    #         # Check if the request was successful
    #         if response.status_code == 200:
    #             # Parse the response JSON
    #             project_data = response.json()

    #             # Retrieve the automatically generated project ID from the response
    #             project_id = project_data['id']  # PocketBase returns the new record's ID

    #             # Redirect to the next page (question form), passing the project_id in the URL
    #             return redirect(url_for('question_form', project_id=project_id))
    #         else:
    #             # Handle error response
    #             return f"Error creating project: {response.text}", response.status_code

    #     except Exception as e:
    #         return f"An error occurred while creating the project: {str(e)}"

    # Render the project creation form if the method is GET
    return render_template('project-form.html', active_page='project-form')

ChangeRequestForm
@app.route('/change-request')
def change_request():
    return render_template('change_Request.html')

@app.route('/client-change-request')
def client_change_request():
    return render_template('client-change_Request.html')
=======
main

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

@app.route('/client-question-form')
def client_question():
    return render_template('client-question-form.html')

@app.route('/modify-settings')
def modify_settings():
    return render_template('modify-settings.html', active_page='settings')

@app.route('/question-form')
def question_form():   #project_id
    return render_template('question-form.html', active_page = 'project-form') #,project_id=project_id

@app.errorhandler(404)
def page_not_found(e): 
    return render_template('404.html'), 404

@app.route('/project-detail')
def project_detail():
    return render_template('project-detail.html', active_page='project')

ChangeRequestForm
@app.route('/client-project-detail')
def client_project_detail():
    project_id = request.args.get('projectId')
    if project_id:
        return render_template('client-project-detail.html', project_id=project_id,active_page='project')
    return render_template('client-project-detail.html', active_page='project')

@app.route('/status-update')
def status_update():
    return render_template('status-update.html', active_page='project-form')
=======
@app.route('/help')
def help():
    return render_template('help.html', active_page='help')

@app.route('/project-detail-client')
def project_detail_client():
    return render_template('project-detail-client.html', active_page='project')
main

if __name__ == '__main__':
    app.run(debug=True)