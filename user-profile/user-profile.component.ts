import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { RegisterRequestPayload } from 'src/app/model/register-request.payload';
import { ImageService } from 'src/app/service/image.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  userId!: any;
  firstname!: any;
  lastname!: any;
  email!: any;
  enabled!: any;
  role!: any;
  selectedFile!: File;
  base64Data!: any;
  retrieveResponse!: any;
  url = "";
  userForm!: FormGroup;
  userRequest!: RegisterRequestPayload;


  constructor(private imageService: ImageService, private toastr: ToastrService,
    private userService: UserService, private app: AppComponent) {
      this.userRequest = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      }
    }

  ngOnInit(): void {
    this.getUserDetails();
    this.showImage();
    this.fillForm();
    this.userForm = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
  }

  public getUserDetails() {
    this.userService.getUserById().subscribe(response => {
      this.userId = response.userId;
      this.firstname = response.firstname;
      this.lastname = response.lastname;
      this.email = response.email;
      this.enabled = response.enabled;
      this.role = response.role;
    })
  }

  public onSelectedFile(event: any) {
    this.selectedFile = <File> event.target.files[0];
    if (event.target.files) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedFile);
      fileReader.onload = (e: any) => {
        this.url = e.target.result;
      }
    }
  }

  public onUpload() {
    var formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.imageService.uploadImage(formData).subscribe(data => {
      this.toastr.success('Image was successfully saved!');
      this.app.showImage();
    }, error => {
      this.toastr.error('There was an error saving image!');
      console.error(error.message);
    })
  }

  public getImage() {
    this.imageService.downloadImage().subscribe(response => {
      this.retrieveResponse = response;
      this.base64Data = this.retrieveResponse.image;
      this.url= 'data:' + this.retrieveResponse.fileType + ';base64,' + this.base64Data;
    })
  }

  public showImage() {
    if (this.getImage() == null) {
      this.url = "./assets/img/default-profile.png";
    } else {
      this.getImage();
    }
  }

  public deleteImage() {
    this.imageService.deleteImage().subscribe(response => {
      this.toastr.success(response);
      this.showImage();
      this.app.showImage();
    }, error => {
      this.toastr.error('An error occurred while deleting image!');
    })
  }

  public updateUser() {
    this.userService.updateUser(this.mapToRequest()).subscribe(response => {
      this.toastr.success(response.responseMessage);
      this.getUserDetails();
      this.app.getUserDetails();
    }, error => {
      console.error(error.message);
    })
  }

  public fillForm() {
    this.userService.getUserById().subscribe(response => {
      this.userForm = new FormGroup({
        id: new FormControl({value: response.userId, disabled: true}),
        firstname: new FormControl(response.firstname, Validators.required),
        lastname: new FormControl(response.lastname, Validators.required),
        email: new FormControl(response.email, Validators.required)
      });
    })
  }

  public mapToRequest(): RegisterRequestPayload {
    this.userRequest.firstname = this.userForm.get('firstname')?.value;
    this.userRequest.lastname = this.userForm.get('lastname')?.value;
    this.userRequest.email = this.userForm.get('email')?.value;
    return this.userRequest;
  }

}
