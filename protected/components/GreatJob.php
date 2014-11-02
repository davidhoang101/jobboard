<?php 
	//call : $this->widget('GreatJob');   
	class GreatJob extends CWidget{
	
		public function init(){
			$baseurl = Yii::app()->request->baseUrl;
		}
		
		public function run() {						
			$Criteria = new CDbCriteria();
			$Criteria->select = 't.title, t.id, c.name com_name, c.id com_id ';
			$Criteria->join = 'LEFT JOIN companies c ON c.id = t.company_id';
			$Criteria->order = "updated DESC limit 16";					
			$this->render('greatjob',array(
				'model'=>Jobs::model()->findAll($Criteria)
			));			
			parent::run();
		}	
			
	}

?>