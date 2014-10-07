<?php

/**
 * This is the model class for table "jobs".
 *
 * The followings are the available columns in table 'jobs':
 * @property string $id
 * @property integer $type_id
 * @property integer $category_id
 * @property integer $company_id
 * @property string $title
 * @property string $contact_way
 * @property string $description
 * @property string $job_require
 * @property string $contact_des
 * @property string $contact_dep
 * @property string $contact_add
 * @property string $cv_lang
 * @property string $created_on
 * @property integer $is_temp
 * @property integer $is_active
 * @property integer $views_count
 * @property integer $career_link_id
 */
class Jobs extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'jobs';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('type_id, category_id, company_id, is_temp, is_active, views_count, career_link_id', 'numerical', 'integerOnly'=>true),
			array('title, contact_way', 'length', 'max'=>255),
			array('cv_lang', 'length', 'max'=>200),
			array('description, job_require, contact_des, contact_dep, contact_add, created_on', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, type_id, category_id, company_id, title, contact_way, description, job_require, contact_des, contact_dep, contact_add, cv_lang, created_on, is_temp, is_active, views_count, career_link_id', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'type_id' => 'Type',
			'category_id' => 'Category',
			'company_id' => 'Company',
			'title' => 'Title',
			'contact_way' => 'Contact Way',
			'description' => 'Description',
			'job_require' => 'Job Require',
			'contact_des' => 'Contact Des',
			'contact_dep' => 'Contact Dep',
			'contact_add' => 'Contact Add',
			'cv_lang' => 'Cv Lang',
			'created_on' => 'Created On',
			'is_temp' => 'Is Temp',
			'is_active' => 'Is Active',
			'views_count' => 'Views Count',
			'career_link_id' => 'Career Link',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id,true);
		$criteria->compare('type_id',$this->type_id);
		$criteria->compare('category_id',$this->category_id);
		$criteria->compare('company_id',$this->company_id);
		$criteria->compare('title',$this->title,true);
		$criteria->compare('contact_way',$this->contact_way,true);
		$criteria->compare('description',$this->description,true);
		$criteria->compare('job_require',$this->job_require,true);
		$criteria->compare('contact_des',$this->contact_des,true);
		$criteria->compare('contact_dep',$this->contact_dep,true);
		$criteria->compare('contact_add',$this->contact_add,true);
		$criteria->compare('cv_lang',$this->cv_lang,true);
		$criteria->compare('created_on',$this->created_on,true);
		$criteria->compare('is_temp',$this->is_temp);
		$criteria->compare('is_active',$this->is_active);
		$criteria->compare('views_count',$this->views_count);
		$criteria->compare('career_link_id',$this->career_link_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Jobs the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
