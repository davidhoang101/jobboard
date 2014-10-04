<?php
/* @var $this JobApplicationsController */
/* @var $model JobApplications */

$this->breadcrumbs=array(
	'Job Applications'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List JobApplications', 'url'=>array('index')),
	array('label'=>'Create JobApplications', 'url'=>array('create')),
	array('label'=>'View JobApplications', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage JobApplications', 'url'=>array('admin')),
);
?>

<h1>Update JobApplications <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>