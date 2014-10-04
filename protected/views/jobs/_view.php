<?php
/* @var $this JobsController */
/* @var $data Jobs */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('type_id')); ?>:</b>
	<?php echo CHtml::encode($data->type_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('category_id')); ?>:</b>
	<?php echo CHtml::encode($data->category_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('company_id')); ?>:</b>
	<?php echo CHtml::encode($data->company_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('title')); ?>:</b>
	<?php echo CHtml::encode($data->title); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('contact_way')); ?>:</b>
	<?php echo CHtml::encode($data->contact_way); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('description')); ?>:</b>
	<?php echo CHtml::encode($data->description); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('job_require')); ?>:</b>
	<?php echo CHtml::encode($data->job_require); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('contact_des')); ?>:</b>
	<?php echo CHtml::encode($data->contact_des); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('contact_dep')); ?>:</b>
	<?php echo CHtml::encode($data->contact_dep); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('contact_add')); ?>:</b>
	<?php echo CHtml::encode($data->contact_add); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cv_lang')); ?>:</b>
	<?php echo CHtml::encode($data->cv_lang); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('created_on')); ?>:</b>
	<?php echo CHtml::encode($data->created_on); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('is_temp')); ?>:</b>
	<?php echo CHtml::encode($data->is_temp); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('is_active')); ?>:</b>
	<?php echo CHtml::encode($data->is_active); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('views_count')); ?>:</b>
	<?php echo CHtml::encode($data->views_count); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('career_link_id')); ?>:</b>
	<?php echo CHtml::encode($data->career_link_id); ?>
	<br />

	*/ ?>

</div>