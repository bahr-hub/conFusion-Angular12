import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../Services/feedback.service'; 

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand(),
      visibility()
    ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform')
  feedbackFormDirective!: { resetForm: () => void; };
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  contactType = ContactType;
  feedbackErrMess = '';
  auxSubmitting = true;
  feedbackCopy!: Feedback;
  visibility = 'shown';

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };


  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required,
         Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required,
         Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: [0, [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        (this.formErrors as any)[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = (this.validationMessages as any)[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              (this.formErrors as any)[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedbackCopy = this.feedbackForm.value;
    this.feedbackService.postFeedback(this.feedbackCopy)
      .subscribe(feedback => {
        this.visibility = 'hidden'; this.auxSubmitting = false;
        setTimeout(() => { this.auxSubmitting = true;
           this.feedback = feedback; }, 1000);
      },
        errmess => {
          this.visibility = 'hidden'; this.auxSubmitting = false;
          setTimeout(() => { this.feedback = null!,
             this.auxSubmitting = true,
              this.feedbackErrMess = <any>errmess; }, 1000);
        });


    setTimeout(() => {
      this.feedback = null!;
      this.feedbackCopy = null!;
      this.feedbackErrMess = null!;
      this.visibility = 'shown';
      this.feedbackFormDirective.resetForm();
    }, 6000);
  }

}
