<div id="search-1" class="ui-tabs-hide ui-tabs-panel ui-widget-content ui-corner-bottom">
            <div class="holder list-job-cate">
                <ul>
                    <?php
                    if ($model) {
                         foreach ($model as $key => $value) {                                                  
                     ?>
                     <li><?php echo CHtml::link($value['name'],array('categories/detail','id' => $value['category_id'])); ?>  <span>(<?php echo $value['count']; ?>)</span></li>                              
                    <?php } } ?>
                </ul>
            </div>
        </div>