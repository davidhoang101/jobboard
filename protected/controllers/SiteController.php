<?php

class SiteController extends Controller {

    /**
     * Declares class-based actions.
     */
    public function actions() {
        return array(
            // captcha action renders the CAPTCHA image displayed on the contact page
            'captcha' => array(
                'class' => 'CCaptchaAction',
                'backColor' => 0xFFFFFF,
                ),
            // page action renders "static" pages stored under 'protected/views/site/pages'
            // They can be accessed via: index.php?r=site/page&view=FileName
            'page' => array(
                'class' => 'CViewAction',
                ),
            );
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        Yii::app()->theme="jobboard";
        $this->layout='//layouts/home';
        $this->render('index');
    }    

   /* public function getArticles($page) {

    }*/

    /**
     * This is the action to handle external exceptions.
     */
    public function actionError() {
        if ($error = Yii::app()->errorHandler->error) {
            if (Yii::app()->request->isAjaxRequest)
                echo $error['message'];
            else
                $this->render('error', $error);
        }
    }

    /**
     * Displays the contact page
     */
    public function actionContact() {
        $model = new ContactForm;
        if (isset($_POST['ContactForm'])) {
            $model->attributes = $_POST['ContactForm'];
            if ($model->validate()) {
                $name = '=?UTF-8?B?' . base64_encode($model->name) . '?=';
                $subject = '=?UTF-8?B?' . base64_encode($model->subject) . '?=';
                $headers = "From: $name <{$model->email}>\r\n" .
                "Reply-To: {$model->email}\r\n" .
                "MIME-Version: 1.0\r\n" .
                "Content-Type: text/plain; charset=UTF-8";

                mail(Yii::app()->params['adminEmail'], $subject, $model->body, $headers);
                Yii::app()->user->setFlash('contact', 'Thank you for contacting us. We will respond to you as soon as possible.');
                $this->refresh();
            }
        }
        $this->render('contact', array('model' => $model));
    }

    /**
     * Displays the login page
     */
    public function actionLogin() {
        $model = new LoginForm;

        // if it is ajax validation request
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'login-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }

        // collect user input data
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
            // validate user input and redirect to the previous page if valid
            if ($model->validate() && $model->login())
                $this->redirect(Yii::app()->user->returnUrl);
        }
        // display the login form
        $this->render('login', array('model' => $model));
    }

    /**
     * Logs out the current user and redirect to homepage.
     */
    public function actionLogout() {
        Yii::app()->user->logout();
        $this->redirect(Yii::app()->homeUrl);
    }

    public function actionCategory(){
         Yii::app()->theme="jobboard";
        $this->layout='//layouts/home';
        
        $criteria = new CDbCriteria;
        $criteria->select = 't.id AS id, t.title AS title,com.id AS com_id,com.name AS com_name, ct.id AS city_id, ct.name AS city_name,t.created AS created';
        $criteria->join = ' LEFT JOIN `companies` AS `com` ON com.id = t.company_id';
        $criteria->join .= ' LEFT JOIN `job_category` AS `jc` ON t.id = jc.job_id';
        $criteria->join .= ' LEFT JOIN `job_places` AS `jp` ON t.id = jp.job_id';
        $criteria->join .= ' LEFT JOIN `cities` AS `ct` ON ct.id = jp.place_id';
        $criteria->condition = 'jc.category_id = :category_id';
        $criteria->group = 'id';
        $criteria->params = array(":category_id" => $_GET['ctid']);

        $itemCount = Jobs::model()->count($criteria);
                
        $pages = new CPagination($itemCount);
        $pages->setPageSize(Yii::app()->params['listPerPage']);
        $pages->applyLimit($criteria); 

        $this->render('category',array(
            'model'=>Jobs::model()->findAll($criteria),
            'itemCount'=>$itemCount,
            'page_size'=>Yii::app()->params['listPerPage'],
            'items_count'=>$itemCount,
            'pages'=>$pages,
        ));
    }

     public function actionPlace(){
         Yii::app()->theme="jobboard";
        $this->layout='//layouts/home';
        
        $criteria = new CDbCriteria;
        $criteria->select = 't.id AS id, t.title AS title,com.id AS com_id,com.name AS com_name, ct.id AS city_id, ct.name AS city_name,t.created AS created';
        $criteria->join = ' LEFT JOIN `companies` AS `com` ON com.id = t.company_id';
        $criteria->join .= ' LEFT JOIN `job_category` AS `jc` ON t.id = jc.job_id';
        $criteria->join .= ' LEFT JOIN `job_places` AS `jp` ON t.id = jp.job_id';
        $criteria->join .= ' LEFT JOIN `cities` AS `ct` ON ct.id = jp.place_id';
        $criteria->condition = 'jp.place_id = :place_id';
        $criteria->group = 'id';
        $criteria->params = array(":place_id" => $_GET['pid']);

        $itemCount = Jobs::model()->count($criteria);
                
        $pages = new CPagination($itemCount);
        $pages->setPageSize(Yii::app()->params['listPerPage']);
        $pages->applyLimit($criteria); 

        $this->render('place',array(
            'model'=>Jobs::model()->findAll($criteria),
            'itemCount'=>$itemCount,
            'page_size'=>Yii::app()->params['listPerPage'],
            'items_count'=>$itemCount,
            'pages'=>$pages,
        ));
    }


    public function actionJob(){
        Yii::app()->theme="jobboard";
        $this->layout='//layouts/home';
        
        $criteria = new CDbCriteria;
        $criteria->select = 't.*,com.description AS com_desc,
                            com.id AS com_id, com.name AS com_name,
                            com.members AS com_members,
                            com.web_url AS com_web_url,
                            com.logo_url AS com_logo_url,
                            com.address AS com_address';
        $criteria->join = ' LEFT JOIN `companies` AS `com` ON com.id = t.company_id';
        // $criteria->join .= ' LEFT JOIN `job_category` AS `jc` ON t.id = jc.job_id';
        // $criteria->join .= ' LEFT JOIN `job_places` AS `jp` ON t.id = jp.job_id';
        // $criteria->join .= ' LEFT JOIN `cities` AS `ct` ON ct.id = jp.place_id';
        $criteria->condition = 't.id = :job_id';
        $criteria->params = array(":job_id" => $_GET['jid']);                
        $this->render('job',array(
            'model'=>  $model = Jobs::model()->findAll($criteria)       
        ));
    }

}
