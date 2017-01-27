package controller

import (
	"encoding/json"
	"fmt"
)

const OutletBucket = "outlets"

type Outlet struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Board string `json:"board"`
	Pin   int    `json:"pin"`
	Type  string `json:"type"`
}

func (c *Controller) GetOutlet(id string) (Outlet, error) {
	var outlet Outlet
	return outlet, c.store.Get(OutletBucket, id, &outlet)
}

func (c *Controller) ListOutlets() (*[]interface{}, error) {
	fn := func(v []byte) (interface{}, error) {
		var outlet Outlet
		if err := json.Unmarshal(v, &outlet); err != nil {
			return nil, err
		}
		return map[string]string{
			"id":   outlet.ID,
			"name": outlet.Name,
		}, nil
	}
	return c.store.List(OutletBucket, fn)
}

func (c *Controller) CreateOutlet(outlet Outlet) error {
	fn := func(id string) interface{} {
		outlet.ID = id
		return outlet
	}
	return c.store.Create(OutletBucket, fn)
}

func (c *Controller) UpdateOutlet(id string, payload interface{}) error {
	return c.store.Update(OutletBucket, id, payload)
}

func (c *Controller) DeleteOutlet(id string) error {
	return c.store.Delete(OutletBucket, id)
}

func (c *Controller) ConfigureOutlet(id string, on bool, value int) error {
	var o Outlet
	if err := c.store.Get(OutletBucket, id, &o); err != nil {
		return err
	}
	switch o.Type {
	case "switch":
		return c.doSwitching(o.Pin, on)
	case "pwm":
		if !c.config.EnablePWM {
			return fmt.Errorf("PWM is not enabled")
		}
		return c.doPWM(o.Pin, on, value)
	default:
		return fmt.Errorf("Unknown outlet type: %s", o.Type)
	}
	return nil
}
