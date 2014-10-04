<?php

class JobsController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','view'),
				'users'=>array('*'),
				),
			array('allow', // allow authenticated user to perform 'create' and 'update' actions
				'actions'=>array('create','update','pullData'),
				'users'=>array('@'),
				),
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('admin','delete','pullData'),
				'users'=>array('admin'),
				),
			array('deny',  // deny all users
				'users'=>array('*'),
				),
			);
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new Jobs;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Jobs']))
		{
			$model->attributes=$_POST['Jobs'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Jobs']))
		{
			$model->attributes=$_POST['Jobs'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		$this->loadModel($id)->delete();

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		$dataProvider=new CActiveDataProvider('Jobs');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new Jobs('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Jobs']))
			$model->attributes=$_GET['Jobs'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return Jobs the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=Jobs::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param Jobs $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='jobs-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}

	public function actionPullData(){	
		$records = '';
		$data = array();	
		//fetch data
		if(!empty($_POST['yt0'])) {				
			$data = $this->fetchData($_POST['cate_link'], $_POST['cate_pattern'],
				array($_POST['cate_from_page'], $_POST['cate_to_page']));			
			$records = count($data);			
		}	

		//insert into database
		if(!empty($_POST['yt1'])) {
			foreach($data as $item)
			{
			//insert company
				$com = new Companies;
				$com->name = isset($item['comName']) ? $item['comName'] : '';
				$com->email = isset($item['contactDepartment']) ? $item['contactDepartment'] : '';
				$com->description = isset($item['comDes']) ? $item['comDes'] : '';
				$com->members = isset($item['comNumStaff']) ? $item['comNumStaff'] : '';
				$com->web_url = isset($item['comWeb']) ? $item['comWeb'] : '';
				$com->address = isset($item['contactAdd']) ? $item['contactAdd'] : '';

				if($comId = $com->save()){
					//insert category
					$cate = new Categories;
					$cate->name = isset($item['comName']) ? $item['comName'] : '';
					$cate->description = isset($item['description']) ? $item['description'] : '';
					$cate->keywords = isset($item['comName']) ? $item['comName'] : '';	

					if ($catId = $cate->save()) {
						//insert job			
						$model = new Jobs;
						$model->category_id = isset($comId) ? $comId : 0;
						$model->company_id = isset($catId) ? $catId : 0;
						$model->title = isset($item['jobTitle']) ? $item['jobTitle'] : 0;
						$model->contact_way = isset($item['contactWay']) ? $item['contactWay'] : 0;
						$model->job_require = isset($item['jobSkills']) ? $item['jobSkills'] : 0;
						$model->contact_des = isset($item['contactDes']) ? $item['contactDes'] : 0;
						$model->contact_dep = isset($item['contactDepartment']) ? $item['contactDepartment'] : 0;
						$model->contact_add = isset($item['contactAdd']) ? $item['contactAdd'] : 0;
						$model->cv_lang = isset($item['cvLang']) ? $item['cvLang'] : 0;
						
						$model->save();
					}					
				}
			}
			
			

		}

		$this->render('pullData',array('records_found' => $records));
	}

	public function fetchData($cateLink = 'http://www.careerlink.vn/viec-lam/cntt-phan-mem19',
		$catePattern = '/viec-lam/cntt-phan-mem/19?page=',$offsetLimit = array(1,1)){
		$html = new simple_html_dom();        
        //get all pages of category
		$crawler = new MyCrawler($cateLink,$catePattern);
		$allPages = $crawler->getAllPages($offsetLimit);

        //get  all link of this category
		$allLinks = array();  
		foreach ($allPages as $key => $value) {
			$crawler->getAllLinkOfOnePage($value, $allLinks);
		}

		$rsData = array();
		foreach ($allLinks as $key => $value) {        
			$rsData[] = $crawler->getDetailPost($value);                              
		}  
		
		return $rsData ;                     
	}
}