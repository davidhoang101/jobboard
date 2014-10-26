<?php 
	//call : $this->widget('GreatJob');   
	class JobCates extends CWidget{
	
		public function init(){
			$baseurl = Yii::app()->request->baseUrl;
		}
		
		public function run() {									
			$dbCommand = Yii::app()->db->createCommand("
				   SELECT category_id,c.name,COUNT(*) as count 
				   FROM job_category j
				   LEFT JOIN categories c ON j.category_id = c.id
				   GROUP BY category_id
				");

			$model = $dbCommand->queryAll();
			 $this->render('jobcates',array(
			 	'model'=>$model
			 ));			
			parent::run();
		}	
			
	}

?>