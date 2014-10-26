<?php 
	//call : $this->widget('GreatJob');   
	class JobCates extends CWidget{
	
		public function init(){
			$baseurl = Yii::app()->request->baseUrl;
		}
		
		public function run() {						
			// $Criteria = new CDbCriteria();
			// $Criteria->select = 't.*, (select COUNT(id) from jobs j where j.category_id =t.id) jobcount';		
			// $this->render('jobcates',array(
			// 	'model'=>Categories::model()->findAll($Criteria)
			// ));			
			//parent::run();
		}	
			
	}

?>