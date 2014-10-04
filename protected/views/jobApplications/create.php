<?php
/* @var $this JobApplicationsController */
/* @var $model JobApplications */

$this->breadcrumbs=array(
	'Job Applications'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List JobApplications', 'url'=>array('index')),
	array('label'=>'Manage JobApplications', 'url'=>array('admin')),
);
?>

<h1>Create JobApplications</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>