

export interface ISelectCategory {
  id: number;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  descriptionAr: string;
  descriptionEn: string;
  // price: string;
}

export interface ICategory {
  id: number;
  name: { en: string; ar: string ,fr:string };
  description: { en: string; ar: string ,fr:string  };
  //   price: string;
  image: string | undefined  |null
}



//package done

export interface IPackageSelected {
  id: number;
  nameAr: string;
  nameEn: string;
  price: string;
  imageUrl: string;
  status: string | null;
}

export interface IPackage {
  id: number;
  name: { en: string; ar: string };
  price: string;
  image: string | null | FileList;
  status: string | null  ;
}
export interface ISubADmin {
  id: number;
  name: string;
  email: string;
  password?: string | undefined;
  role: string[];
}


export interface IPermissions {
  id:number;
  name: string;
  display_name: {
    ar: string;
    en: string;
  };
  permissions: string[];
}
export interface ITempPermissions {
  id: number;
  name: string;
  display_nameAr: string;
  display_nameEn: string;
  permissions: { name: string }[]; // Change permissions to an array of objects
}
export interface ICourseSelect {
    id: number;
    nameAr: string;
    nameEn: string;
    price: string;
    imageUrl: string;
    status: string | null;
    category: {
      id: number;
      name: {
        ar: string;
        en: string;
      };
    };
    package: {
      id: number;
      name: {
        ar: string;
        en: string;
      };
    };
    description: {
      en: string;
      ar: string;
    };
  }
  export interface ICourse {
    id: number;
    name: { en: string; ar: string };
    price: string;
    image: string;
    status: string | null;
    category: {
      id: number;
      name: {
        ar: string;
        en: string;
      };
    };
    package: {
      id: number;
      name: {
        ar: string;
        en: string;
      };
    };
    description: {
      en: string;
      ar: string;
    };
  }

  export interface IFormInputCourses {
    name: {
      en: string;
      ar: string;
      fr:string;
    };
    id:number;
    image: FileList |string;
    price: string;
    main_video: string;
    course_duration: string;
    course_level: string;
    course_lang: string;
    priceAfterDiscount: string;
    package_id: number|string;
    category_id: number|string;
    description: {
      en: string;
      ar: string;
      fr:string;
    };
  }

  export interface IPackageLectuerSelected {
    id:number |string
    course:{
      id:number
    }
    title: {
      en: string;
      ar: string;
      fr:string
    };
    description: {
      en: string;
      ar: string;
      fr:string
    };

    video_url: string;
    duration: string;
  }

  export interface ICourseLectuer {
    id: number |string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;

    vedioUrl: string;
    vedioDuration: string | null;
  }

  export interface ICustomer{
    id: number;
    name: string;
    email: string;
    phone: string;
    partner_code: string;
  }

 export interface IREc {
      id:number;
      name:string;
      value:string
      status: string | null  ;
  
  }
export interface IOrder  {
    id: number,
    status: string,
    payment_method: string,
    total: number,
    created_at: string,
    order_type: string,
    user: {
        id: number,
        name: string,
        email: string,
        status: string
    }
}

export interface Ipermisson {
  id:number,name:string,display_name:string
}