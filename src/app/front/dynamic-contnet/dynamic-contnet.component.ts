import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';

@Component({
  selector: 'app-dynamic-contnet',
  templateUrl: './dynamic-contnet.component.html',
  styleUrls: ['./dynamic-contnet.component.css']
})
export class DynamicContnetComponent implements OnInit {
id:any;
  content!: string;
getAllURL: string = 'DynamicPage/GetPageById';
  constructor(private _Activatedroute:ActivatedRoute,private commonService: CommonService){}

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.id = params.get('id'); 
      this.getAllStaticPages();
  });
  }


  getAllStaticPages() {
    var url = `${this.getAllURL}?id=${this.id}`;
    this.commonService.get(url).subscribe(res => {
      if (res != null && res.statusCode == 200) {
        this.content = res.data.pageContent;
      }
    });
  }

}
