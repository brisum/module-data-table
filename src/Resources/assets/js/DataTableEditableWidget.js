'use strict';

import $ from 'jquery';
import Widget from 'widget';

class DataTableEditableWidget extends Widget {
    constructor(props) {
        super(props);
    
        let self = this;
        
        self.$element.on('click', '.cell-editable', function () {
            let $this = $(this);
        
            if ($this.hasClass('edit')) {
                return;
            }
        
            switch ($this.attr('data-field')) {
                case 'text':
                    self.makeText($this);
                    break;
                case 'textarea':
                    self.makeTextArea($this);
                    break;
            }
        });
    }
    
    makeText($cell) {
        let self = this,
          value = $cell.html();
        
        $cell.addClass('edit');
        $cell.html('<input type="text" value="" />');
        $cell.find('input').focus().val(value);
        
        $cell.one('blur', 'input', function () {
            $cell.addClass('loading');
            self.request(
              {
                  id:  $cell.attr('data-id'),
                  key: $cell.attr('data-key'),
                  value: $cell.find('input').val()
              },
              function (response) {
                  $cell.html(response[$cell.attr('data-key')]);
                  $cell.removeClass('edit');
                  $cell.removeClass('loading');
              }
            );
        })
    }
    
    makeTextArea($cell) {
        let self = this,
          value = $cell.html();
        
        $cell.closest('td').addClass('edit-textarea');
        $cell.addClass('edit');
        $cell.html('<textarea></textarea>');
        $cell.find('textarea').focus().val(value);
        
        $cell.one('blur', 'textarea', function () {
            $cell.addClass('loading');
            self.request(
              {
                  id:  $cell.attr('data-id'),
                  key: $cell.attr('data-key'),
                  value: $cell.find('textarea').val()
              },
              function (response) {
                  $cell.html(response[$cell.attr('data-key')]);
                  $cell.closest('td').removeClass('edit-textarea');
                  $cell.removeClass('edit');
                  $cell.removeClass('loading');
              }
            );
        })
    }
    
    request(data, callback) {
        let self = this;
        
        $.ajax({
            url: self.$element.attr('data-action-save-cell'),
            type: 'post',
            data: {
                id:  data.id,
                key: data.key,
                value: data.value
            },
            dataType: 'json',
            success: function (jsonResponse, textStatus, jqXHR) {
                callback && callback(jsonResponse);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.responseText);
            }
        })
    }
}

export default DataTableEditableWidget;
