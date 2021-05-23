# Introduction

<a target="_blank" href="https://pro-course-313800.el.r.appspot.com/">**Covidash India**</a>, named so because it provides a dashboard related to Covid-19 effects & its statistics. This provides data like **Daily cases country-wise stats, Cases per state stats, Hospitals and beds available per state, medical colleges & admission capacities per state, Helplines, Notification & Advisories** sourced from <a target="_blank" href="https://www.mohfw.gov.in">**Ministry of Health and family welfare**</a>.
And data like  **Available centers & slots based on the district and Pincode** by <a target="_blank" href="https://www.cowin.gov.in/home">**Cowin Govt. API**</a>.

# Platform Overview

you can check the website from this <a target="_blank" href="https://pro-course-313800.el.r.appspot.com/">link</a>


![Screenshot 2021-05-20 214731.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1621527498100/v-WXtzEWv.png)

## Project Set-up


#### Pre-requistes 

- You can check my  [Covidash](https://github.com/d-evil0per/coviddash) GitHub repository and download it as a zip file or you can also clone it using git in command prompt or terminal by using the below command.
        $ git clone https://github.com/d-evil0per/coviddash
- navigate to `covidash` directory
        cd covidash
- Project Directory Tree is shown below:

<pre><code>
C:.
│   app.py
│   app.yaml
│   Procfile
│   README.md
│   requirements.txt
│   wsgi.py
│
├───API
│       api.py
│       base_api.py
│       constants.py
│       utils.py
│
├───static
│   ├───css
│   │       news.css
│   │       Social-Icons.css
│   │       styles.css
│   │
│   └───js
│           bs-init.js
│           filter.js
│           main.js
│           script.min.js
│
└───templates
        index.html
        sitemap.xml
</code></pre>

-  **Python flask Framework** has been used as a backend for this project you can use **PHP, Node, etc** as per your choice.

     - If you don't have python installed, Please install it from  **[Python org website](https://www.python.org/downloads/)  **

- **Bootstrap 4** has been used as front-end, you can also use **React, Angular, etc**
    - All **CSS** & **JS** files required you can find it under **App/static** directory
    - there is only one HTML file because it's a **SPA ( Single Page Application)**, you can find it under the **App/templates** directory


- **Cowin API** - Check the official website  [Open APIs](https://apisetu.gov.in/public/marketplace/api/cowin) 

- **COVID-19 REST API** - check the API sourced from  [Ministry of Health and family welfare](https://api.rootnet.in) 

#### Dependency Installation

You need to install all the required libraries used in this project. You can find the **requirements.txt** file in the root directory of this project.


- You can install it using the **pip** command. but before that, we will create a **virtual environment** for this project to avoid loading unwanted libraries into your system which you might not use regularly. 


> Check [Creating Virtual Environment in Python ](https://deviloper.in/creating-virtual-environment-in-python)  blog to install  Virtual environment in python.

- Installing requrements.txt using pip
        pip install -r requirements.txt

#### **Execution**

- Windows
        py wsgi.py

- Linux & MacOS
        python3 wsgi.py
