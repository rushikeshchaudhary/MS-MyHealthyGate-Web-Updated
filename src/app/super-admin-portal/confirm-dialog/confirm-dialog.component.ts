import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string="";
  message: string="";
  status:any;
  percentage:any;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
                this.status=data.status;
              }

  ngOnInit() {
    console.log(this.status,"Status");
    if(this.status){
      const percentage = this.calculatePercentage(this.status);
      this.percentage=percentage;
      console.log(`Percentage: ${percentage}%`);
    }
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
    
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  calculatePercentage(profile: Profile): number {
    const propertiesCount = Object.values(profile).length;
    const onesCount = Object.values(profile).filter(value => value > 0).length;
    return (onesCount / propertiesCount) * 100;
  }
}

interface Profile {
  isProfileSetup: number;
  basicProfile: number;
  staffAvailability: number;
  staffExperiences: number;
  staffQualifications: number;
  staffAwards: number;
  staffTaxonomies: number;
  staffLocation: number;
  staffServices: number;
  staffSpecialities: number;
}
