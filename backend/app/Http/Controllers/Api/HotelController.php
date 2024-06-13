<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\HotelResource;
use Illuminate\Http\Request;
use App\Models\Hotel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class HotelController extends Controller
{
    public function index()
    {
        $hotel = Hotel::latest()->paginate(6);

        foreach ($hotel as $item) {
            $item->image = url('/assets/hotel/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new HotelResource(true, "Data Hotel", $hotel);
    }

    public function show($id)
    {
        $hotel = Hotel::findOrFail($id);

        $hotel->image = url('/assets/hotel/' . $hotel->image);
        $hotel->open = Carbon::parse($hotel->open)->translatedFormat('H:i');
        $hotel->close = Carbon::parse($hotel->close)->translatedFormat('H:i');

        return new HotelResource(true, "Hotel Detail", $hotel);
    }

    public function store(Request $request)
    {
        $validator= Validator::make($request->all(), [
            'image' => 'required|mimes:jpg,png,jpeg|max:5000',
            'name' => 'required',
            'distance' => 'required',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $hotel = new Hotel;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move('assets/hotel/', $imageName);
            $hotel->image = $imageName;
        }
        $hotel->name = $request->name;
        $hotel->distance = $request->distance;
        $hotel->open = $request->open;
        $hotel->close = $request->close;
        $hotel->narration = $request->narration;
        $hotel->save();

        if ($hotel) {
            return new HotelResource(true, "Hotel Created Successfully!", $hotel);
        } else {
            return new HotelResource(false, "Failed To Create Hotel!", null);
        }
    }

    public function update(Request $request, $id)
    {
        $hotel = Hotel::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image' => 'nullable|mimes:jpg,png,jpeg|max:5000',
            'name' => 'required',
            'distance' => 'required',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('image')) {
            $image_path = public_path('assets/hotel/' . $hotel->image);
            if (File::exists($image_path)) {
                File::delete($image_path);
            }

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move('assets/hotel/', $imageName);
            
            $hotel->update([
                'image' => $imageName,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        } else {
            $hotel->update([
                'image' => $hotel->image,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        }

        if ($hotel) {
            return new HotelResource(true, "Updated Hotel Successfully!", $hotel);
        } else {
            return new HotelResource(false, "Update Hotel Failed!", null);
        }
    }

    public function destroy($id)
    {
        $hotel = Hotel::findOrFail($id);

        $imagePath = public_path('assets/hotel/' . $hotel->image);

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }

        $hotel->delete();

        return new HotelResource(true, "Deleted Hotel Successfully!", null);
    }
}
