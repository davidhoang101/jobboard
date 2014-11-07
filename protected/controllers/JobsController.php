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
				'actions'=>array('create','update','Careerlink','Tuoitre','Timvn'),
				'users'=>array('@'),
				),
			array('allow', // allow admin user to perform 'admin' and 'delete' actions
				'actions'=>array('admin','delete'),
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

	public function actionCareerlink(){				
		//////////	
		$cates = Categories::model()->findAll(array('select'=>'id,name'));		
		$records = '';
		$jobs = array();

		//fetch data, if click on save data button
		if(!empty($_POST['yt0'])) {		
			$crawler = new MyCrawler();		
			$jobs = $crawler->getJobs($_POST['nums']);					
			$records = count($jobs);	
			
			foreach($jobs as $item)
			{
				$comId = end(explode('/', $item['comId']));
				$modelCom = Companies::model()->find('careerlink_id=' . $comId);
				//if company does not exist,then insert			
				if (empty($modelCom)) {
					//insert company			
					$com = new Companies;
					$com->name = isset($item['comName']) ? $item['comName'] : '';
					$com->email = isset($item['contactDepartment']) ? $item['contactDepartment'] : '';
					$com->description = isset($item['comDes']) ? $item['comDes'] : '';
					$com->members = isset($item['comNumStaff']) ? $item['comNumStaff'] : '';
					$com->web_url = isset($item['comWeb']) ? $item['comWeb'] : '';					
					$com->careerlink_id = isset($comId) ? intval($comId) : '';
					$com->address = isset($item['contactAdd']) ? $item['contactAdd'] : '';					
					$com->logo_url = isset($item['logo_url']) ? $item['logo_url'] : '';					
					$com->logo_url = isset($item['logo_url']) ? $item['logo_url'] : '';					
					$com->save();
					$comId = $com->id;
				} else {
					$comId = $modelCom->id;
				}				
				
				//if save company successfull				
				if(!empty($comId)){
					$ar = explode('/', $item['jobId']);
					$jobId= $ar[3]; 								
					$modelJob = Jobs::model()->find('career_link_id=' . $jobId);					
					//insert job			
					if (empty($modelJob->id)) {
						$model = new Jobs;

						$model->company_id = isset($comId ) ? $comId : 0;
						$model->title = isset($item['jobTitle']) ? $item['jobTitle'] : 0;
						$model->description = isset($item['jobDes']) ? $item['jobDes'] : 0;
						$model->contact_way = isset($item['contactWay']) ? $item['contactWay'] : 0;
						$model->job_require = isset($item['jobSkills']) ? $item['jobSkills'] : 0;
						$model->contact_des = isset($item['contactDes']) ? $item['contactDes'] : 0;
						$model->contact_name = isset($item['contactName']) ? $item['contactName'] : 0;
						$model->contact_person = isset($item['contactPerson']) ? $item['contactPerson'] : 0;
						$model->contact_add = isset($item['contactAdd']) ? $item['contactAdd'] : 0;
						$model->cv_lang = isset($item['cvLang']) ? $item['cvLang'] : 0;	
						$model->career_link_id = isset($jobId) ? intval($jobId) : 0;	
						$model->job_salary = isset($item['job_salary']) ? $item['job_salary'] : '';
						$model->job_level = isset($item['job_level']) ? $item['job_level'] : '';
						$model->applicant_level = isset($item['applicant_level']) ? $item['applicant_level'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->created_on = isset($item['created_on']) ? $item['created_on'] : '';
						$model->end_date = isset($item['end_date']) ? $item['end_date'] : '';
						$model->applicant_gender = isset($item['applicant_gender']) ? $item['applicant_gender'] : '';
						$model->applicant_age = isset($item['applicant_age']) ? $item['applicant_age'] : '';
						$model->job_type = isset($item['job_type']) ? $item['job_type'] : '';
						$model->job_code = isset($item['job_code']) ? $item['job_code'] : '';
						if($model->save()){		

							if(!empty($item['place_id'])) {
								foreach ($item['place_id'] as $key => $value) {
									  $value = end(explode('/', $value));
									if (!JobPlaces::model()->exists('job_id=? AND place_id=?',array($model->id, $value))){
										$jpModel = new JobPlaces;
										$jpModel->job_id = $model->id;
										$jpModel->place_id = $value;
										if(!$jpModel->save()){
											print_r($jpModel->getErrors());
										};
									}									
								}
								
							}

							if(!empty($item['categoryId'])) {
								foreach ($item['categoryId'] as $keyp => $valuep) {
									if (is_numeric(end(explode('/', $valuep)))){										
										if (!JobCategory::model()->exists('job_id=? AND category_id=?',array($model->id, $valuep))){
											$jcModel = new JobCategory;
											$jcModel->job_id = $model->id;
											$jcModel->category_id = end(explode('/', $valuep));
											$jcModel->save();
											if(!$jcModel->save()){
												echo 'job cate';
												print_r($jcModel->getErrors());
											};
										}
									}										
								}
								
							}
					
						} else {
							echo "job";
							print_r($model->getErrors());die;
						}
					}					
					

				} else {
					echo "company";
					print_r($com->getErrors());die;
				}
			}
			unset($jobs);		
		}			

		$this->render('careerlink',array('records_found' => $records,'cates' => $cates));
	}


	public function actionTuoiTre(){	
		$cates = Categories::model()->findAll(array('select'=>'id,name'));		
		$records = '';
		$jobs = array();

		//fetch data, if click on save data button
		if(!empty($_POST['yt0'])) {	
			$catId = $_POST['cate_id'];		
			$crawler = new VlttCrawler($_POST['cate_link'],$_POST['cate_pattern']);
			$jobs = $crawler->fetchData($_POST['cate_from_page'], $_POST['cate_to_page'], $_POST['nums']);			
			$records = count($jobs);	
			
			foreach($jobs as $item){				

				$modelCom = Companies::model()->find("careerlink_id='".$item['comId']."'");
				//if company does not exist,then insert			
				if (empty($modelCom)) {
					//insert company			
					$com = new Companies;
					$com->name = isset($item['comName']) ? $item['comName'] : '';
					$com->email = isset($item['contactDepartment']) ? $item['contactDepartment'] : '';
					$com->description = isset($item['comDes']) ? $item['comDes'] : '';
					$com->members = isset($item['comNumStaff']) ? $item['comNumStaff'] : '';
					$com->web_url = isset($item['comWeb']) ? $item['comWeb'] : '';					
					$com->careerlink_id = isset($item['comId']) ? $item['comId'] : '';
					$com->address = isset($item['contactAdd']) ? $item['contactAdd'] : '';					
					$com->save();
					$comId = $com->id;
				} else {
					$comId = $modelCom->id;
				}				
				
				//if save company successfull				
				if(!empty($comId)){									
					$modelJob = Jobs::model()->find("career_link_id='".$item['jobId']."'");					
					//insert job			
					if (empty($modelJob->id)) {
						$model = new Jobs;
					  //print_r($item);die;
						$model->category_id = $catId ? $catId : 0;
						$model->company_id = isset($comId ) ? $comId : 0;
						$model->title = isset($item['jobTitle']) ? $item['jobTitle'] : 0;
						$model->description = isset($item['jobDes']) ? $item['jobDes'] : 0;
						$model->contact_way = isset($item['contactWay']) ? $item['contactWay'] : 0;
						$model->job_require = isset($item['jobSkills']) ? $item['jobSkills'] : 0;
						$model->contact_des = isset($item['contactDes']) ? $item['contactDes'] : 0;
						$model->contact_name = isset($item['contactName']) ? $item['contactName'] : 0;
						$model->contact_person = isset($item['contactPerson']) ? $item['contactPerson'] : 0;
						$model->contact_add = isset($item['contactAdd']) ? $item['contactAdd'] : 0;
						$model->cv_lang = isset($item['cvLang']) ? $item['cvLang'] : 0;	
						$model->career_link_id = isset($item['jobId']) ? $item['jobId'] : 0;	
						$model->job_salary = isset($item['job_salary']) ? $item['job_salary'] : '';
						$model->job_level = isset($item['job_level']) ? $item['job_level'] : '';
						$model->applicant_level = isset($item['applicant_level']) ? $item['applicant_level'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->created_on = isset($item['created_on']) ? $item['created_on'] : '';
						$model->end_date = isset($item['end_date']) ? $item['end_date'] : '';
						$model->applicant_gender = isset($item['applicant_gender']) ? $item['applicant_gender'] : '';
						$model->applicant_age = isset($item['applicant_age']) ? $item['applicant_age'] : '';
						$model->job_type = isset($item['job_type']) ? $item['job_type'] : '';
						$model->job_code = isset($item['job_code']) ? $item['job_code'] : '';
						if($model->save()){		

							if(!empty($item['place_id'])) {
								foreach ($item['place_id'] as $key => $value) {
									  $value = end(explode('/', $value));
									if (!JobPlaces::model()->exists('job_id=? AND place_id=?',array($model->id, $value))){
										$jpModel = new JobPlaces;
										$jpModel->job_id = $model->id;
										$jpModel->place_id = $value;
										if(!$jpModel->save()){
											print_r($jpModel->getErrors());
										};
									}									
								}
								
							}

							if(!empty($item['categoryId'])) {
								foreach ($item['categoryId'] as $keyp => $valuep) {
									if (is_numeric(end(explode('/', $valuep)))){										
										if (!JobCategory::model()->exists('job_id=? AND category_id=?',array($model->id, $valuep))){
											$jcModel = new JobCategory;
											$jcModel->job_id = $model->id;
											$jcModel->category_id = $valuep;
											$jcModel->save();
											if(!$jcModel->save()){
												echo 'job cate';
												print_r($jcModel->getErrors());
											};
										}
									}										
								}
								
							}
					
						} else {
							echo "job";
							print_r($model->getErrors());
						}
					}					
					

				} else {
					echo "company";
					print_r($com->getErrors());
				}
			}
			unset($jobs);		
		}			

		$this->render('tuoitre',array('records_found' => $records,'cates' => $cates));
	}



	public function actionTimvn(){	
		$cates = Categories::model()->findAll(array('select'=>'id,name'));		
		$records = '';
		$jobs = array();

		//fetch data, if click on save data button
		if(!empty($_POST['yt0'])) {	
			$catId = $_POST['cate_id'];		
			$crawler = new TvnCrawler($_POST['cate_link'],$_POST['cate_pattern']);
			$jobs = $crawler->fetchData($_POST['cate_from_page'], $_POST['cate_to_page'], $_POST['nums']);			
			$records = count($jobs);	
			
			foreach($jobs as $item){				

				$modelCom = Companies::model()->find("careerlink_id='".$item['comId']."'");
				//if company does not exist,then insert			
				if (empty($modelCom)) {
					//insert company			
					$com = new Companies;
					$com->name = isset($item['comName']) ? $item['comName'] : '';
					$com->email = isset($item['contactDepartment']) ? $item['contactDepartment'] : '';
					$com->description = isset($item['comDes']) ? $item['comDes'] : '';
					$com->members = isset($item['comNumStaff']) ? $item['comNumStaff'] : '';
					$com->web_url = isset($item['comWeb']) ? $item['comWeb'] : '';					
					$com->careerlink_id = isset($item['comId']) ? $item['comId'] : '';
					$com->address = isset($item['contactAdd']) ? $item['contactAdd'] : '';					
					$com->save();
					$comId = $com->id;
				} else {
					$comId = $modelCom->id;
				}				
				
				//if save company successfull				
				if(!empty($comId)){									
					$modelJob = Jobs::model()->find("career_link_id='".$item['jobId']."'");					
					//insert job			
					if (empty($modelJob->id)) {
						$model = new Jobs;
					  //print_r($item);die;
						$model->category_id = $catId ? $catId : 0;
						$model->company_id = isset($comId ) ? $comId : 0;
						$model->title = isset($item['jobTitle']) ? $item['jobTitle'] : 0;
						$model->description = isset($item['jobDes']) ? $item['jobDes'] : 0;
						$model->contact_way = isset($item['contactWay']) ? $item['contactWay'] : 0;
						$model->job_require = isset($item['jobSkills']) ? $item['jobSkills'] : 0;
						$model->contact_des = isset($item['contactDes']) ? $item['contactDes'] : 0;
						$model->contact_name = isset($item['contactName']) ? $item['contactName'] : 0;
						$model->contact_person = isset($item['contactPerson']) ? $item['contactPerson'] : 0;
						$model->contact_add = isset($item['contactAdd']) ? $item['contactAdd'] : 0;
						$model->cv_lang = isset($item['cvLang']) ? $item['cvLang'] : 0;	
						$model->career_link_id = isset($item['jobId']) ? $item['jobId'] : 0;	
						$model->job_salary = isset($item['job_salary']) ? $item['job_salary'] : '';
						$model->job_level = isset($item['job_level']) ? $item['job_level'] : '';
						$model->applicant_level = isset($item['applicant_level']) ? $item['applicant_level'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->applicant_experience = isset($item['applicant_experience']) ? $item['applicant_experience'] : '';
						$model->created_on = isset($item['created_on']) ? $item['created_on'] : '';
						$model->end_date = isset($item['end_date']) ? $item['end_date'] : '';
						$model->applicant_gender = isset($item['applicant_gender']) ? $item['applicant_gender'] : '';
						$model->applicant_age = isset($item['applicant_age']) ? $item['applicant_age'] : '';
						$model->job_type = isset($item['job_type']) ? $item['job_type'] : '';
						$model->job_code = isset($item['job_code']) ? $item['job_code'] : '';
						if($model->save()){		

							if(!empty($item['place_id'])) {
								foreach ($item['place_id'] as $key => $value) {
									  $value = end(explode('/', $value));
									if (!JobPlaces::model()->exists('job_id=? AND place_id=?',array($model->id, $value))){
										$jpModel = new JobPlaces;
										$jpModel->job_id = $model->id;
										$jpModel->place_id = $value;
										if(!$jpModel->save()){
											print_r($jpModel->getErrors());
										};
									}									
								}
								
							}

							if(!empty($item['categoryId'])) {
								foreach ($item['categoryId'] as $keyp => $valuep) {
									if (is_numeric(end(explode('/', $valuep)))){										
										if (!JobCategory::model()->exists('job_id=? AND category_id=?',array($model->id, $valuep))){
											$jcModel = new JobCategory;
											$jcModel->job_id = $model->id;
											$jcModel->category_id = $valuep;
											$jcModel->save();
											if(!$jcModel->save()){
												echo 'job cate';
												print_r($jcModel->getErrors());
											};
										}
									}										
								}
								
							}
					
						} else {
							echo "job";
							print_r($model->getErrors());
						}
					}					
					

				} else {
					echo "company";
					print_r($com->getErrors());
				}
			}
			unset($jobs);		
		}			

		$this->render('timviecnhanh',array('records_found' => $records,'cates' => $cates));
	}
	
}
