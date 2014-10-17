<?php
class TvnCrawler {

	public $baseUrl = 'http://www.timviecnhanh.com';
	public $categoryLinkPattern = '/vieclam/tuyendung/17/cong-nghe-thong-tin.html?page=';
	public $cateUrl = 'http://www.timviecnhanh.com/vieclam/tuyendung/17/cong-nghe-thong-tin.html';

	public function VlttCrawler($cateUrl, $categoryLinkPattern){
		$this->cateUrl = $this->cateUrl;
		$this->categoryLinkPattern = $this->categoryLinkPattern;
	}

	public function fetchData($fromPage, $toPage, $limitRecords){				
        //get all pages of category		
		$allPages = $this->getPageLink($fromPage, $toPage);				
        //get  all link of this category
		$allLinks = array();  
		foreach ($allPages as $key => $value) {
			$this->getAllLinkOfOnePage($value, $allLinks);
		}
		
		$rsData = array();
		$iter = 1;
		foreach ($allLinks as $key => $value) {        
			if($iter > $limitRecords && $limitRecords != 0){
				break;
			} else {
				$rsData[] = $this->getDetailPost($value);                              				                          
			}
			$iter++;
		}  
		//print_r($rsData);die;			
		return $rsData ;                     
	}

	//get detail of post
	function getDetailPost($postUrl){
		header('Content-Type: text/html; charset=utf-8');		
		$results = array();
		$html = new simple_html_dom();
		$html->load_file($postUrl);

		$comInfos = array();
		$temp = array();
		
		$results['comName'] = isset($html->find('div[class=tit_company]',0)->plaintext) ?
								$html->find('div[class=tit_company]',0)->plaintext : '';								
		$results['comNumStaff'] = NULL; 
		$results['comWeb'] = NULL; 


		$results['comDes'] = $html->find('#emp_more') ? 
						$html->find('#emp_more',0)->plaintext : '';


		$results['jobDes'] = $html->find('.content_fck',0) ? 
						$html->find('.content_fck',0)->innertext : '';

		$results['jobSkills'] = $html->find('.content_fck',1) ? 
						$html->find('.content_fck',1)->innertext : '';
		$results['jobSkills'] .= $html->find('.content_fck',2) ? 
						$html->find('.content_fck',2)->innertext : '';			


		$results['contactPerson'] = $html->find('.TitleDetailNew',0) ? 
						$html->find('.TitleDetailNew',0)->children(2)->children(0)->plaintext : '';	
		$results['contactAdd'] = $html->find('.TitleDetailNew',0) ? 
						$html->find('.TitleDetailNew',0)->children(1)->children(0)->plaintext : '';

		$results['contactWay'] = ''; 
		$results['contactDes'] = ''; 		
		$results['contactName'] = ''; 		

		$results['cvLang'] = ''; 		
		
		$results['jobTitle'] = $html->find('.LeftJobCB',0) ? 
						$html->find('.LeftJobCB',0)->children(0)->plaintext : '';

		$results['jobId'] = $html->find('.b_blue',0) ? 
						$html->find('.b_blue',0)->href : '';
		$results['jobId'] = substr(strrchr($results['jobId'], '='),1);

				
		$results['comId'] = $html->find('.viewmorejob',0) ? 
						$html->find('.viewmorejob',0)->children(0)->href : '';
		$results['comId'] = substr(strrchr($results['comId'], '.'),1);

				
		foreach ($html->find('a[itemprop=industry]') as $industry) {			
			$results['categoryId'][] = substr(strrchr($industry->href, '/'),1);
		}

		foreach ($html->find('b[itemprop=jobLocation] a') as $pla) {			
			$results['place_id'][] = substr(strrchr($pla->href, '/'),1);
		}
		
		$results['job_level'] = isset($html->find('label[itemprop=occupationalCategory]',0)->plaintext) ?
								$html->find('label[itemprop=occupationalCategory]',0)->plaintext : '';		
		$results['applicant_level'] = '';
		$results['applicant_experience'] = $html->find('.DetailJobNew',0) ? 
						trim(str_replace('Kinh nghiệm:', '', $html->find('.DetailJobNew',0)->children(1)->children(0)->plaintext)) : '';	
		$results['job_type'] = '';
		$results['job_salary'] = $html->find('.DetailJobNew',0) ? 
						trim(str_replace('Lương:', '', $html->find('.DetailJobNew',0)->children(1)->children(1)->plaintext)) : '';
		$results['applicant_age'] = '';
		$results['applicant_gender'] = '';
		$results['job_code'] = '';

		$results['created_on'] = $html->find('.datepost',0) ?
								trim(str_replace('Ngày đăng:', '',$html->find('.datepost',0)->plaintext)) : ''; 
		$results['end_date'] = ($html->find('.DetailJobNew',0) && $html->find('.DetailJobNew',0)->children(2)
								 && $html->find('.DetailJobNew',0)->children(2)->children(1))? 
						$html->find('.DetailJobNew',0)->children(2)->children(1)->plaintext : '';
		
		
		return $results;   
	}

	//get all link of page
	//pageLink: http://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=2
	function getAllLinkOfOnePage($pageLink, &$results){		
		$html = new simple_html_dom();
		$html->load_file($pageLink);
		$items = $html->find('dd[class=] span[class=jobtitle] a');
		foreach ($items as $link) {  
			$results[] = $this->baseUrl . $link->href;
		}
		return $results;
	}


	/*
	*get all page of category
	*input: offsetLimit : from page to page
	*output: all link of page of category
	*http://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=2
	*/
	function getPageLink($fromPage, $toPage){				
		$pages = array();    	
    	//loop and get all page's link
		for ($i = $fromPage; $i <= $toPage; $i++) { 
			$pages[] = $this->baseUrl . $this->categoryLinkPattern . $i;
		}		

		return $pages;
	}

	
	
}