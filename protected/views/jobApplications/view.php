<?php
/* @var $this JobApplicationsController */
/* @var $model JobApplications */

$this->breadcrumbs=array(
	'Job Applications'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List JobApplications', 'url'=>array('index')),
	array('label'=>'Create JobApplications', 'url'=>array('create')),
	array('label'=>'Update JobApplications', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete JobApplications', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage JobApplications', 'url'=>array('admin')),
);
?>

<h1>View JobApplications #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'job_id',
		'name',
		'email',
		'cv_path',
		'message',
		'created_on',
		'ip',
	),
)); ?>
