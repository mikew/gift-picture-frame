package frame

type BrightnessController interface {
	GetBrightness() (int, error)
	GetMaxBrightness() (int, error)
	GetMinBrightness() (int, error)
	SetBrightness(level int) error
}
