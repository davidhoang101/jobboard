<?php 
	//call : $this->widget('GreatJob');   
	class JobByPlace extends CWidget{
	
		public function init(){
			$baseurl = Yii::app()->request->baseUrl;
		}
		
		public function run() {						
			$dbCommand = Yii::app()->db->createCommand("
				   SELECT place_id,c.name,COUNT(*) as count 
				   FROM job_places j
				   LEFT JOIN cities c ON j.place_id = c.id
				   GROUP BY place_id
				");

			$model = $dbCommand->queryAll();
			 $this->render('jobbyplace',array(
			 	'model'=>$model
			 ));			
		}	
			
	}

?>