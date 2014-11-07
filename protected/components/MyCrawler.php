<?php
class MyCrawler {

	private $_baseUrl = 'http://www.careerlink.vn';
	private $_link = 'http://www.careerlink.vn/vieclam/list/?page=';
	
	
	function getJobs(){	
		$results = array();			
		$rsData = NULL;		
		$html = new simple_html_dom();			
		for ($i=1; $i < 2; $i++) {		
			$html->load_file($this->_link . $i);			
			foreach ($html->find('tr[class=normal]') as $post) {			        												
				// if(strtotime($post->children(4)->children(0)->plaintext) < strtotime('25-10-2014')) { //strtotime(date('d-m-Y'))
				// 	$break = TRUE;
				// 	break;
				// }				
				$rsData[] = $this->getDetailPost(
					$this->_baseUrl . $post->children(1)->children(0)->attr['href']); 
			}
			// if ($break){
			// 	break;
			// }	

		}		
		return $rsData;
	}


	//get detail of post
	function getDetailPost($postUrl){
		header('Content-Type: text/html; charset=utf-8');		
		$results = array();
		$html = new simple_html_dom();
		$html->load_file($postUrl);

		$comInfos = array();
		$temp = array();


		foreach ($html->find('div[class=ntd-chitietvieclam] table td') as $companyInfo) {			
			 $comInfos[]= $companyInfo->plaintext;       
		} 	
		
		if (count($comInfos) == 6)	{
			$results['comName'] = $comInfos[1]; 			
			$results['comWeb'] = ''; 
			$results['comNumStaff'] = $comInfos[3]; 
			unset($comInfos);
		} else {
			$results['comName'] = $comInfos[1]; 			
			$results['comWeb'] = $comInfos[3];
			$results['comNumStaff'] = $comInfos[5]; 
			unset($comInfos);
		}


		foreach ($html->find('div[id=firmDescrip]') as $comDes) {
			$comInfos[] = $comDes->innertext;       
		}   
		$results['comDes'] = html_entity_decode($comInfos[0]); 
		unset($comInfos);	


		
		foreach ($html->find('div[class=mceContentBody]') as $jobDes) {
			$comInfos[] = $jobDes->innertext;       
		} 
		$results['jobDes'] = html_entity_decode($comInfos[0]); 
		$results['jobSkills'] = html_entity_decode($comInfos[1]); 
		unset($comInfos);


		
		foreach ($html->find('li[class=clearfix]') as $contact) {
			$comInfos[] = $contact->plaintext;       
		} 
		$results['contactWay'] = isset($comInfos[0]) ? trim(str_replace('Cách liên hệ:', '', html_entity_decode($comInfos[0]))) : ''; 
		$results['contactDes'] = isset($comInfos[1]) ? trim(str_replace('Mô tả:', '', html_entity_decode($comInfos[1]))) : ''; 		
		$results['contactName'] = isset($comInfos[2]) ? trim(str_replace('Tên liên hệ:', '', html_entity_decode($comInfos[2]))) : ''; 		
		$results['contactAdd'] = isset($comInfos[3]) ? trim(str_replace('Địa chỉ:', '', html_entity_decode($comInfos[3]))) : ''; 
		$results['contactPerson'] = isset($comInfos[4]) ? trim(str_replace('Nguời liên hệ:','',html_entity_decode($comInfos[4]))) : ''; 
		unset($comInfos);
		
		
		foreach ($html->find('span[class=confi_text]') as $langCv) {
			$comInfos[] = $langCv->innertext;       
		}   
		$results['cvLang'] = $comInfos[0]; 
		unset($comInfos);

		
		foreach ($html->find('div[class=container] h1') as $jobTitle) {
			$comInfos[] = $jobTitle->plaintext;       
		}
		$results['jobTitle'] = $comInfos[0]; 
		unset($comInfos);
	
	
		foreach ($html->find('a[class=lk-company]') as $com) {			     
			$comInfos[] = $com->href;       			  
		}
		$results['comId'] = $comInfos[0]; 
		unset($comInfos);

		foreach ($html->find('a[class=nop]') as $jjoob) {			
			$comInfos[] = $jjoob->href;    
		}	
		$results['jobId'] = $comInfos[0]; 
		unset($comInfos);
				
		foreach ($html->find('div[class=list-mota]') as $item) {			
			foreach ($item->find('li a') as $key) {							
				$comInfos[] = $key->href;
			}
		}	
		$results['categoryId'] = $comInfos;
		unset($comInfos);				

		$iter = 0;
		foreach ($html->find('div[class=list-mota] ul li ul') as $right) {			
			if ($iter == 0) {
				foreach ($right->find('a') as $value) {
					$comInfos['categoryId'][] = $value->href;
				}
			}
			if ($iter == 1) {				
				foreach ($right->find('a') as $r2val) {
					$comInfos['place_id'][] = $r2val->href;
				}
			}
			$iter++;			
		}
		
		$results['categoryId'] = $comInfos['categoryId'];	
		$results['place_id']   = $comInfos['place_id'];					 
		unset($comInfos);

		$run = 0;
		foreach ($html->find('div[class=list-mota] span[class=no-link]') as $right) {
			$run++;
			$comInfos[] = $right->innertext;    							
		}				
		if ($run == 8) {
			$jobCode = $comInfos[0];
			$comInfos[] = array_shift($comInfos);
			$comInfos[] = $jobCode;			
		}		
		$results['job_level'] = $comInfos[0];
		$results['applicant_level'] = $comInfos[1];
		$results['applicant_experience'] = $comInfos[2];
		$results['job_type'] = $comInfos[3];
		$results['job_salary'] = $comInfos[4];
		$results['applicant_age'] = $comInfos[5];
		$results['applicant_gender'] = $comInfos[6];
		$results['job_code'] = isset($comInfos[7]) ? $comInfos[7] : NULL;
		unset($comInfos);		

		foreach ($html->find('div[class=ngaydang] span') as $ddt) {			
			$comInfos[] = $ddt->plaintext;       
		}		
		$results['created_on'] = trim($comInfos[0]); 
		$results['end_date'] = $comInfos[1]; 
		unset($comInfos);
		
		$results['logo_url'] = $html->find('.ttchung',0)->children(0) ? 
						$this->_baseUrl . $html->find('.ttchung',0)->children(0)->src : '';

		
		return $results;   
	}
	
}