<?php 
	//call : $this->widget('GreatJob');   
	class TopEmployer extends CWidget{
	
		public function init(){
			$baseurl = Yii::app()->request->baseUrl;
		}
		
		public function run() {											
			$this->render('greatjob',array(
				'model'=>''
			));			
			parent::run();
		}	
			
	}

?>