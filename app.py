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

if __name__ == '__main__':
    app.run(debug=True)
