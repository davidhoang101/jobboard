<?php
class MyCrawler {

	public $baseUrl = 'http://www.careerlink.vn';
	public $categoryLinkPattern = '/viec-lam/cntt-phan-mem/19?page=';
	public $cateUrl = 'http://www.careerlink.vn/viec-lam/cntt-phan-mem/19';
	public $postUrl = 'http://www.careerlink.vn/tim-viec-lam/user-interface-ui-intern/575500';

	public function init($cateUrl,$categoryLinkPattern){
		$this->categoryLinkPattern = $categoryLinkPattern;
		$this->cateUrl = $cateUrl;
	}

	//get detail of post
	function getDetailPost($postUrl){
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
			$comInfos[] = $comDes->plaintext;       
		}   
		$results['comDes'] = html_entity_decode($comInfos[0]); unset($comInfos);	

		foreach ($html->find('div[class=mceContentBody]') as $jobDes) {
			$comInfos[] = $jobDes->plaintext;       
		} 
		$results['jobDes'] = html_entity_decode($comInfos[0]); 
		$results['jobSkills'] = html_entity_decode($comInfos[1]); 
		unset($comInfos);

		foreach ($html->find('li[class=clearfix] span') as $contact) {
			$comInfos[] = $contact->plaintext;       
		} 
		$results['contactWay'] = html_entity_decode($comInfos[1]); 
		$results['contactDes'] = html_entity_decode($comInfos[3]); 		
		$results['contactDepartment'] = html_entity_decode($comInfos[6] . $comInfos[7]); 
		$results['contactAdd'] = html_entity_decode(end($comInfos)); 
		unset($comInfos);
		
		foreach ($html->find('span[class=confi_text]') as $langCv) {
			$comInfos[] = $langCv->plaintext;       
		}   
		$results['cvLang'] = $comInfos[0]; 
		unset($comInfos);
		foreach ($html->find('div[class=container] h1') as $jobTitle) {
			$comInfos[] = $jobTitle->plaintext;       
		}
		$results['jobTitle'] = $comInfos[0]; 
		unset($comInfos);
		
		foreach ($html->find('a[class=lk-company]') as $com) {
			//print_r($com->href);die;
			//$comInfos[] = end(explode('/', $com->href));       
			$comInfos[] = $com->href;       
		}
		$results['comId'] = $comInfos[0]; 
		unset($comInfos);

		foreach ($html->find('a[class=nop]') as $jjoob) {
			$ar = explode('/', $jjoob->href);
			$comInfos[] = $ar[3];       
		}	
		$results['jobId'] = $comInfos[0]; 
		unset($comInfos);
				// /return $comInfos;
		return array_map('trim',$results);   
	}
	
	/*
	*get all page of category
	*input:
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
	
}