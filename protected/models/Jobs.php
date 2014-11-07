<?php

/**
 * This is the model class for table "jobs".
 *
 * The followings are the available columns in table 'jobs':
 * @property string $id
 * @property integer $company_id
 * @property string $title
 * @property string $description
 * @property string $job_require
 * @property string $contact_way
 * @property string $contact_des
 * @property string $contact_person
 * @property string $contact_add
 * @property string $contact_name
 * @property string $job_salary
 * @property string $cv_lang
 * @property string $job_level
 * @property string $applicant_level
 * @property string $applicant_experience
 * @property string $created_on
 * @property string $end_date
 * @property integer $is_temp
 * @property string $applicant_gender
 * @property string $applicant_age
 * @property string $job_type
 * @property integer $is_active
 * @property integer $views_count
 * @property string $career_link_id
 * @property string $job_code
 * @property string $created
 * @property string $updated
 */
class Jobs extends CActiveRecord
{
	public $com_name;
	public $com_id;
	public $com_desc;
	public $com_members;
	public $com_web_url;
	public $com_logo_url;
	public $com_address;
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
			array('company_id, is_temp, is_active, views_count', 'numerical', 'integerOnly'=>true),
			array('title, contact_way', 'length', 'max'=>255),
			array('contact_name, job_salary, cv_lang, job_level, applicant_level, applicant_experience, applicant_gender, applicant_age, job_type, job_code', 'length', 'max'=>200),
			array('created_on, end_date, career_link_id', 'length', 'max'=>50),
			array('description, job_require, contact_des, contact_person, contact_add, created, updated', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, company_id, title, description, job_require, contact_way, contact_des, contact_person, contact_add, contact_name, job_salary, cv_lang, job_level, applicant_level, applicant_experience, created_on, end_date, is_temp, applicant_gender, applicant_age, job_type, is_active, views_count, career_link_id, job_code, created, updated', 'safe', 'on'=>'search'),
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
			'company_id' => 'Company',
			'title' => 'Title',
			'description' => 'Description',
			'job_require' => 'Job Require',
			'contact_way' => 'Contact Way',
			'contact_des' => 'Contact Des',
			'contact_person' => 'Contact Person',
			'contact_add' => 'Contact Add',
			'contact_name' => 'Contact Name',
			'job_salary' => 'Job Salary',
			'cv_lang' => 'Cv Lang',
			'job_level' => 'Job Level',
			'applicant_level' => 'Applicant Level',
			'applicant_experience' => 'Applicant Experience',
			'created_on' => 'Created On',
			'end_date' => 'End Date',
			'is_temp' => 'Is Temp',
			'applicant_gender' => 'Applicant Gender',
			'applicant_age' => 'Applicant Age',
			'job_type' => 'Job Type',
			'is_active' => 'Is Active',
			'views_count' => 'Views Count',
			'career_link_id' => 'Career Link',
			'job_code' => 'Job Code',
			'created' => 'Created',
			'updated' => 'Updated',
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
		$criteria->compare('company_id',$this->company_id);
		$criteria->compare('title',$this->title,true);
		$criteria->compare('description',$this->description,true);
		$criteria->compare('job_require',$this->job_require,true);
		$criteria->compare('contact_way',$this->contact_way,true);
		$criteria->compare('contact_des',$this->contact_des,true);
		$criteria->compare('contact_person',$this->contact_person,true);
		$criteria->compare('contact_add',$this->contact_add,true);
		$criteria->compare('contact_name',$this->contact_name,true);
		$criteria->compare('job_salary',$this->job_salary,true);
		$criteria->compare('cv_lang',$this->cv_lang,true);
		$criteria->compare('job_level',$this->job_level,true);
		$criteria->compare('applicant_level',$this->applicant_level,true);
		$criteria->compare('applicant_experience',$this->applicant_experience,true);
		$criteria->compare('created_on',$this->created_on,true);
		$criteria->compare('end_date',$this->end_date,true);
		$criteria->compare('is_temp',$this->is_temp);
		$criteria->compare('applicant_gender',$this->applicant_gender,true);
		$criteria->compare('applicant_age',$this->applicant_age,true);
		$criteria->compare('job_type',$this->job_type,true);
		$criteria->compare('is_active',$this->is_active);
		$criteria->compare('views_count',$this->views_count);
		$criteria->compare('career_link_id',$this->career_link_id,true);
		$criteria->compare('job_code',$this->job_code,true);
		$criteria->compare('created',$this->created,true);
		$criteria->compare('updated',$this->updated,true);

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
