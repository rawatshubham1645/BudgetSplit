import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useMutation from '@/hooks/useMutation';
import uploadFiles from '@/hooks/uploadFiles';
import { USERS_PROFILE } from '@/imports/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '@/redux/features/user/userSlice';

function Profile() {
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const { mutate: updateUser } = useMutation();
  
  const userData=useSelector(selectUser)

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body={
      ...formData,
      // profilePicUrl: previewImage
    }

    console.log(previewImage,formData.profilePicUrl,'eeeeeeeeee')
    if(previewImage!==formData.profilePicUrl &&previewImage){
      const uploadFile=await uploadFiles([previewImage])
      if(uploadFile?.length){
        body.profilePicUrl=uploadFile[0]
      }
    }

    const response=await updateUser({
      url: USERS_PROFILE,
      method: 'PUT',
      data: body
     });
     console.log(response,'qqqqqqqq')
     if(response?.success){
            dispatch(setUser({ ...response?.data?.data, token: null }));
      
      navigate(-1)
     }
   
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;