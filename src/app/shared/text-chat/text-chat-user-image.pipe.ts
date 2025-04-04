import { Pipe, PipeTransform } from "@angular/core";
import { from } from "rxjs";

@Pipe({
  name: "textChatUserImage"
})
export class TextChatUserImagePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    var image = "./assets/img/noimage1.png";
    var userList = from(args);
    var index = args.findIndex((x: { userId: any; }) => x.userId == value);
    if (index > -1) {
      image = args[index].image; //args.find(x => x.userId == value).image;
    }
    if (image == "" || image == null || image == undefined)
      image = "./assets/img/noimage1.png";
    // userList.subscribe((user: any) => {
    //   if (user.userId == value) {
    //     image = user.image;
    //   }
    // });
    return image;
  }
}
