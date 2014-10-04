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

		$results['comName'] = $comInfos[1];
		$results['comWeb'] = $comInfos[3];
		$results['comNumStaff'] = $comInfos[5];
		$results['comContact'] = $comInfos[7];
		$results['comDes'] = $comInfos[8];
		$results['jobDes'] = $comInfos[9];
		$results['jobSkills'] = $comInfos[10];
		$results['contactWay'] = $comInfos[12];
		$results['contactDes'] = $comInfos[14];
		$results['contactDepartment'] = $comInfos[16];
		$results['contactAdd'] = $comInfos[18];
		$results['cvLang'] = $comInfos[21];

		return array_map('trim',$results);   
	}
	
	/*
	*get all page of category
	*input:
	*output: all link of page of category
	*http://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=2
	*/
	function getAllPages(){
		$html = new simple_html_dom();    
		$html->load_file($this->cateUrl);

		$maxPage = 0;
		$pages = array();
    	//get max page
		foreach($html->find('ul[class=pagination] a') as $a){    
			$maxPage = ($maxPage > intval($a->innertext)) ? $maxPage : intval($a->innertext);    
		}

    	//loop and get all page's link
		for ($i=1; $i <= $maxPage; $i++) { 
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