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
		foreach ($html->find('div[class=ntd-chitietvieclam] table td') as $companyInfo) {
			$comInfos[] = $companyInfo->plaintext;       
		} 

		foreach ($html->find('div[id=firmDescrip]') as $comDes) {
			$comInfos[] = $comDes->plaintext;       
		}   

		foreach ($html->find('div[class=mceContentBody]') as $jobDes) {
			$comInfos[] = $jobDes->plaintext;       
		} 

		foreach ($html->find('li[class=clearfix] span') as $contact) {
			$comInfos[] = $contact->plaintext;       
		} 

		foreach ($html->find('span[class=confi_text]') as $langCv) {
			$comInfos[] = $langCv->plaintext;       
		}   

		foreach ($html->find('div[class=container] h1') as $jobTitle) {
			$comInfos[] = $jobTitle->plaintext;       
		}
		
		foreach ($html->find('a[class=lk-company]') as $com) {
			$comInfos[] = end(explode('/', $com->href));       
		}
		foreach ($html->find('a[class=nop]') as $jjoob) {
			$ar = explode('/', $jjoob->href);
			$comInfos[] = $ar[3];       
		}	
		
		$results['comName'] = isset($comInfos[1]) ? $comInfos[1] : '';
		$results['comWeb'] = isset($comInfos[3]) ? $comInfos[3] : '';
		$results['comNumStaff'] = isset($comInfos[5]) ? $comInfos[5] : '';
		$results['comContact'] = isset($comInfos[7]) ? $comInfos[7] : '';
		$results['comDes'] = isset($comInfos[8]) ? html_entity_decode($comInfos[8]) : '';
		$results['jobDes'] = isset($comInfos[9]) ? html_entity_decode($comInfos[9]) : '';
		$results['jobSkills'] = isset($comInfos[10]) ? html_entity_decode($comInfos[10]) : '';
		$results['contactWay'] = isset($comInfos[12]) ? $comInfos[12] : '';
		$results['contactDes'] = isset($comInfos[14]) ? html_entity_decode($comInfos[14]) : '';
		$results['contactDepartment'] = isset($comInfos[16]) ? html_entity_decode($comInfos[16]) : '';
		$results['contactAdd'] = isset($comInfos[18]) ? html_entity_decode($comInfos[18]) : '';
		$results['cvLang'] = isset($comInfos[21]) ? $comInfos[21] : '';
		$results['jobTitle'] = isset($comInfos[22]) ? $comInfos[22] : '';
		$results['comId'] = isset($comInfos[23]) ? $comInfos[23] : '';
		$results['jobId'] = isset($comInfos[24]) ? $comInfos[24] : '';
		
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