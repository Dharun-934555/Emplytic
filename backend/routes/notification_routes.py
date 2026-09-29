from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_db
import schemas
import auth
from bson import ObjectId

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[schemas.NotificationOut])
def get_notifications(
    db = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    cursor = db.notifications.find({
        "$or": [
            {"user_id": current_user["id"]},
            {"user_id": None}
        ]
    }).sort("created_at", -1).limit(30)
    
    notifications = []
    for notif in cursor:
        notif["id"] = str(notif.pop("_id"))
        notifications.append(notif)
    return notifications

@router.put("/{notification_id}/read", response_model=schemas.NotificationOut)
def mark_notification_read(
    notification_id: str,
    db = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    try:
        obj_id = ObjectId(notification_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid notification ID format")
        
    result = db.notifications.find_one_and_update(
        {"_id": obj_id},
        {"$set": {"is_read": True}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found")
    result["id"] = str(result.pop("_id"))
    return result

@router.put("/read-all")
def mark_all_read(
    db = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    db.notifications.update_many(
        {
            "$or": [
                {"user_id": current_user["id"]},
                {"user_id": None}
            ]
        },
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read"}
