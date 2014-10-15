<?php
class VlttCrawler {

	public $baseUrl = 'http://vieclam.tuoitre.vn/vi';
	public $categoryLinkPattern = '/tim-viec-lam/nganh-nghe/cntt-phan-mem/limit/20/page/';
	public $cateUrl = 'http://vieclam.tuoitre.vn/vi/tim-viec-lam/nganh-nghe/cntt-phan-mem';

	/*
	*get all page of category
	*input: offsetLimit : from page to page
	*output: all link of page of category
	*http://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=2
	*/
	function getAllPages($offsetLimit){
		$html = new simple_html_dom();    
		$html->load_file($this->cateUrl);

		$maxPage = 0;
		$pages = array();    	

    	//loop and get all page's link
		for ($i = $offsetLimit[0]; $i <= $offsetLimit[1]; $i++) { 
			$pages[] = $this->baseUrl . $this->categoryLinkPattern . $i;
		}		

		return $pages;
	}


	//get all link of page
	//pageLink: http://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=2
	function getAllLinkOfOnePage($pageLink, &$results){		
		$html = new simple_html_dom();
		$html->load_file($pageLink);
		$items = $html->find('tr[class=normal]');
		foreach ($items as $post) {             
			$results[] = $this->baseUrl . $post->children(1)->children(0)->attr['href'];
		}
		return $results;
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
		$results['comName'] = $comInfos[1]; 
		$results['comNumStaff'] = $comInfos[5]; 
		$results['comWeb'] = $comInfos[3]; 
		unset($comInfos);


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
			$comInfos[] = $contact->innertext;       
		} 
		$results['contactWay'] = isset($comInfos[0]) ? html_entity_decode($comInfos[0]) : ''; 
		$results['contactDes'] = isset($comInfos[1]) ? html_entity_decode($comInfos[1]) : ''; 		
		$results['contactName'] = isset($comInfos[2]) ? html_entity_decode($comInfos[2]) : ''; 		
		$results['contactAdd'] = isset($comInfos[3]) ? html_entity_decode($comInfos[3]) : ''; 
		$results['contactPerson'] = isset($comInfos[4]) ? html_entity_decode($comInfos[4]) : ''; 
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
			//$comInfos[] = end(explode('/', $com->href));       
		}
		$results['comId'] = $comInfos[0]; 
		unset($comInfos);

		foreach ($html->find('a[class=nop]') as $jjoob) {
			// $ar = explode('/', $jjoob->href);
			// $comInfos[] = $ar[3];    
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
		// foreach ($comInfos as $key => $value) {
		// 	if (is_numeric(end(explode('/', $value)))){
		// 		$results['categoryId'][] = $comInfos;
		// 	}
		// }
		

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
		//$comInfos['categoryId'][] = end(explode('/', $value->href));
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
		$results['created_on'] = $comInfos[0]; 
		$results['end_date'] = $comInfos[1]; 
		unset($comInfos);
		
		return $results;   
	}
	
}