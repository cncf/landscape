package verify

import (
	"fmt"
	"os"

	types "github.com/cncf/landscape/pkg/types"
	"gopkg.in/yaml.v3"
)

func Verify(f string) error {
	yamlFile, err := os.ReadFile(f)
	if err != nil {
		return fmt.Errorf("yamlFile.Get err   #%v ", err)
	}

	data := types.LandscapeList{}
	err = yaml.Unmarshal(yamlFile, &data)
	if err != nil {
		return fmt.Errorf("unmarshal error: %v", err)
	}

	return nil
}
