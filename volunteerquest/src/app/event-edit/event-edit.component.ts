import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { EventManagerService } from '../services/search-engine/event-manager.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { GooglemapService } from '../services/googlemap.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialTimeControlModule } from '../../../node_modules/material-time-control/src/material-time-control.module';
import { Validators } from '@angular/forms/src/validators';

@Component({
  selector: 'event-edit',
  providers: [EventManagerService, GooglemapService],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private EventManagerService: EventManagerService,
              public dialogRef: MatDialogRef<EventEditComponent>,
              private GoogleMapService: GooglemapService,
              public snackBar: MatSnackBar,
              private __zone: NgZone) { }

  states = [
    {value: 'GA', viewValue: 'Georgia'},
  ];

  title: string;
  content: string;
  likes: number = 0;
  lat: number;
  lng: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  category: string;
  url: string;
  date: Date;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  time = {hour: 12, minute: 0, meriden: 'PM', format: 12};
  eventForm: FormGroup;

  eventIsRepeating:boolean = false;
  eventIsMonthly:boolean = false;
  eventIsWeekly:boolean = false;
  eventIsBiWeekly:boolean = false;

  repeatEndDate: Date;
  repeatEventArr:Date[] = [];

  dateFilter = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 
    // Prevent dates before today from being selected.
    return date > yesterday;
  }

  ngOnInit() {
    // console.log("In createEvent, uid:", this.data.uid);
  }

  createEvent() {
    // this.EventManagerService.add
    let address = this.street + ', ' + this.city + ', ' + this.state + ', ' + this.zipcode;
    // console.log("address:", JSON.stringify(address));
    this.GoogleMapService.getGeocoding(address).subscribe(result => {
      this.__zone.run(() => {
        // console.log("Result from Google Maps:", JSON.stringify(result));
        if (result.hasOwnProperty('lat')) {
          //Save data to firestore
          this.lat = result.lat();
          this.lng = result.lng();

          //Get a list of recurring events
          this.populateRecurringDates();
          //For each date in the recurrence list, create a new event with that date
          this.repeatEventArr.forEach(recurrDate => {
            this.EventManagerService.add({title: this.title, content: this.content,
              likes: this.likes, lat: this.lat, lng: this.lng,
              street: this.street, city: this.city,
              zipcode: this.zipcode, date: recurrDate,
              uid: this.data.uid, category: 'humanitarian', expanded: false})
            
            .catch(onrejected => {
              console.log("Unable to add event, onrejected:", onrejected);
            })
            .then(value => {
              console.log("Successfully added event, value:", value);
              this.dialogRef.close();
              this.snackBar.open("Created New Event: " + this.title, '', {
                duration: 2500
              });
            });
          });
          
        } else {
          console.log("Unable to get coordinates from inputted address");
          this.snackBar.open("The provided address was invalid, unable to create event", '', {
            duration: 2800
          });
        }
      })
    },
    error => {
      console.log("Error:", error)
      this.snackBar.open(error, '', {
        duration: 2800
      })
    },
      () => console.log("Done")
    );
  }

  editEvent() {
    // this.EventManagerService.getCollection$
  }

  toggleIsRepeating(event) {
    console.log(event.checked);
    if (event.checked) {
        this.eventIsRepeating = true;
    } else {
      this.eventIsRepeating = false;
    }
  }

  toggleWeeklyRepeating(event) {
    if (event.checked) {
      this.eventIsWeekly = true;
    } else {
      this.eventIsWeekly = false;
    }
  }

  toggleBiWeeklyRepeating(event) {
    if (event.checked) {
      this.eventIsBiWeekly = true;
    } else {
      this.eventIsBiWeekly = false;
    }
  }

  toggleMonthlyRepeating(event) {
    if (event.checked) {
      this.eventIsMonthly = true;
    } else {
      this.eventIsMonthly = false;
    }
  }

  populateRecurringDates() {
    var curr_date = new Date(this.date);

    if (this.eventIsMonthly) {
      while (curr_date.getTime() < this.repeatEndDate.getTime()) {
        if(curr_date.getDate() == this.date.getDate()) {
          this.repeatEventArr.push(new Date(curr_date));
        }
        curr_date.setDate(curr_date.getDate() + 1);
      }
      
    } else if (this.eventIsBiWeekly) {
      while (curr_date.getTime() < this.repeatEndDate.getTime()) {
        this.repeatEventArr.push(new Date(curr_date));
        curr_date.setDate(curr_date.getDate() + 14);
      }
    } else if (this.eventIsWeekly) {
      while (curr_date.getTime() < this.repeatEndDate.getTime()) {
        this.repeatEventArr.push(new Date(curr_date));
        curr_date.setDate(curr_date.getDate() + 7);
      }
    } else {
      //not a repeating event
      this.repeatEventArr.push(this.date);
    }
    //console.log(this.repeatEventArr);

  }
}
