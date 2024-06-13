<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\FacilityResource;
use Illuminate\Http\Request;
use App\Models\Facility;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class FacilityController extends Controller
{
    public function index()
    {
        $facility = Facility::latest()->paginate(6);

        foreach ($facility as $item) {
            $item->image = url('assets/facility/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new FacilityResource(true, "Facility Data", $facility);
    }

    public function show($id)
    {
        $facility = Facility::findOrFail($id);

        $facility->image = url('assets/facility/' . $facility->image);
        $facility->open = Carbon::parse($facility->open)->translatedFormat('H:i');
        $facility->close = Carbon::parse($facility->close)->translatedFormat('H:i');

        return new FacilityResource(true, "Detail Facility", $facility);
    }

    public function store(Request $request)
    {
        $validator  = Validator::make($request->all(), [
            'image' => 'required|mimes:jpg,jpeg,png',
            'name' => 'required',
            'distance' => 'required|numeric',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $facility = new Facility;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . "." . $image->getClientOriginalExtension();
            $image->move('assets/facility/', $imageName);
            $facility->image = $imageName;
        }
        $facility->name = $request->name;
        $facility->distance = $request->distance;
        $facility->open = $request->open;
        $facility->close = $request->close;
        $facility->narration = $request->narration;

        $facility->save();

        if ($facility) {
            return new FacilityResource(true, "Facility Created Successfully", $facility);
        } else {
            return new FacilityResource(false, "Failed To Create Facility", null);
        }
    }

    public function update(Request $request, $id)
    {
        $facility = Facility::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image' => 'nullable|mimes:png,jpg,jpeg',
            'name' => 'required',
            'distance' => 'required|numeric',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('image')) {
            $imagePath = public_path('assets/facility', $facility->image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }

            $image = $request->file('image');
            $imageName = time() . "." . $image->getClientOriginalExtension();
            $image->move('assets/facility', $imageName);
            
            $facility->update([
                'image' => $facility->image = $imageName,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        } else {
            $facility->update([
                'image' => $facility->image,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        }

        if ($facility) {
            return new FacilityResource(true, "Facility Updated Successfully!", $facility);
        } else {
            return new FacilityResource(false, "Failed To Update Facility!", null);
        }
    }

    public function destroy($id)
    {
        $facility = Facility::findOrFail($id);

        $imagePath = public_path('assets/facility/' . $facility->image);
        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }

        $facility->delete();

        if ($facility) {
            return new FacilityResource(true, "Facility Deleted Successfully!", null);
        } else {
            return new FacilityResource(false, "Failed To Delete Facility", null);
        }
    }
}
