<?php
/* @var $this JobsController */
/* @var $model Jobs */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'jobs-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'type_id'); ?>
		<?php echo $form->textField($model,'type_id'); ?>
		<?php echo $form->error($model,'type_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'category_id'); ?>
		<?php echo $form->textField($model,'category_id'); ?>
		<?php echo $form->error($model,'category_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'company_id'); ?>
		<?php echo $form->textField($model,'company_id'); ?>
		<?php echo $form->error($model,'company_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'title'); ?>
		<?php echo $form->textField($model,'title',array('size'=>60,'maxlength'=>100)); ?>
		<?php echo $form->error($model,'title'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'contact_way'); ?>
		<?php echo $form->textField($model,'contact_way',array('size'=>60,'maxlength'=>100)); ?>
		<?php echo $form->error($model,'contact_way'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'description'); ?>
		<?php echo $form->textArea($model,'description',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'description'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'job_require'); ?>
		<?php echo $form->textArea($model,'job_require',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'job_require'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'contact_des'); ?>
		<?php echo $form->textField($model,'contact_des',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'contact_des'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'contact_dep'); ?>
		<?php echo $form->textField($model,'contact_dep',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'contact_dep'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'contact_add'); ?>
		<?php echo $form->textField($model,'contact_add',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'contact_add'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'cv_lang'); ?>
		<?php echo $form->textField($model,'cv_lang',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'cv_lang'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'created_on'); ?>
		<?php echo $form->textField($model,'created_on'); ?>
		<?php echo $form->error($model,'created_on'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'is_temp'); ?>
		<?php echo $form->textField($model,'is_temp'); ?>
		<?php echo $form->error($model,'is_temp'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'is_active'); ?>
		<?php echo $form->textField($model,'is_active'); ?>
		<?php echo $form->error($model,'is_active'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'views_count'); ?>
		<?php echo $form->textField($model,'views_count'); ?>
		<?php echo $form->error($model,'views_count'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->