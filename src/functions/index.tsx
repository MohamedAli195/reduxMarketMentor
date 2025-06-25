import { RootState, store } from "app/store";
import axios from "axios";
import i18n from "i18n";
import { Ipermisson } from "interfaces";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";





const url = import.meta.env.VITE_API_URL;
const token = store.getState().auth.authData.token;

console.log(token)

const storedPermissions = localStorage.getItem('permissions');
export let parsedData:Ipermisson[];
if (storedPermissions) {
  parsedData = JSON.parse(storedPermissions);
    // console.log(parsedData);
} else {
   
    console.log('No data found!');
   
}
  // Delete package function
export  const deleteAnyThing = async (id: number,refetch:()=>void ,module:string) => {
    
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    try {
      await axios.delete(
        `${url}/admin/${module}/${id}/destroy`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(`${module} with ID ${id} deleted successfully`); 
      refetch()
    } catch (error) {
      // console.error('Failed to delete package:', error);
      toast.error('Error deleting package');
    }
  };


    /// Api requestes
    export const fetchAllData = async (page=1,perpage=1,search='',sort_dir:string,typeFilter='',module:string) => {

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const response = await axios.get(
      `${url}/admin/${module}?per_page=${perpage}&page=${page}&search=${search}&sort_direction=${sort_dir}&type=${typeFilter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:'application/json',
          lang:i18n.language
        },
      },
    );
    console.log(response)
    return response.data;
  };
  /// Api requestes
  export const fetchPackagesOrCAtegoriesForCourses = async (module:string) => {

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const response = await axios.get(
      `${url}/admin/${module}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:'application/json',
          lang:i18n.language
        },
      },
    );

    return response.data;
  };

      /// Api requestes tomorow
      export const fetchOne = async (id:number|undefined|string,module:string) => {
    
        if (!token) throw new Error("Authorization token is missing");
    
        try {
            const response = await axios.get(
                `${url}/admin/${module}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${module} details:`, error); // Log full error
            throw error; // Rethrow to handle in useQuery's error state
        }
    };


    export const updateStatus = async (id:number|undefined,path:string,status2:string) => {
      if (!token) throw new Error("Authorization token is missing");
  
      try {
          const response = await axios.post(
              `${url}/admin/${path}/${id}/change-status`,
              {status : status2},
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          // console.log(response)
      } catch (error) {
          console.error("Error fetching package details:", error); // Log full error
          throw error; // Rethrow to handle in useQuery's error state
      }
  };

  export const fetchLectuers = async (id:string|undefined,page=10,perpage=1,search='',sort_dir='') => {

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const response = await axios.get(
      `${url}/admin/course-lectures/course/${id}?per_page=${perpage}&page=${page}&search=${search}&sort_direction=${sort_dir}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:'application/json',
          lang:i18n.language
        },
      },
    );

    return response.data;
  };


  /// add package Function 
  

  // fetchNotifications 

  export const fetchNotifications = async () => {
    if (!token) throw new Error("Authorization token is missing");

    try {
        const response = await axios.get(
            `${url}/admin/admin-notifications`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching notifications details:`, error); // Log full error
        throw error; // Rethrow to handle in useQuery's error state
    }
};

export const fetchCountOfNotifications = async () => {
  if (!token) throw new Error("Authorization token is missing");

  try {
      const response = await axios.get(
          `${url}/admin/admin-count-of-notifications`,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      console.error(`Error fetching notifications details:`, error); // Log full error
      if(error.response.status===401){
        localStorage.removeItem("token")
        window.location.pathname="/authentication/login"
      }
      
  }
};

export const readNotification = async (id:number) => {

  if (!token) throw new Error("Authorization token is missing");
  console.log(token)
  try {
      const response = await axios.post(
          `${url}/admin/admin-read-of-notification/${id}`,
          {

          },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
      console.log(response.data)
      return response.data;
  } catch (error) {
      console.error(`Error reading notifications details:`, error); // Log full error
      throw error; // Rethrow to handle in useQuery's error state
  }
};

export const checkPermissions = (permissions: Ipermisson[] | undefined, one: string | undefined) => {
  if(permissions)
  {
    return permissions.some(item => item.name === one);

  }
};